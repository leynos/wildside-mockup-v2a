import { readFileSync } from "node:fs";
import { relative } from "node:path";
import ts from "typescript";

type Location = { line: number; column: number };

type NormalizedClass = {
  filePath: string;
  location: Location;
  raw: string;
  tokens: string[];
  tokenSet: Set<string>;
  signature: string;
  context: ElementContext;
};

type ElementContext = {
  tagName: string;
  parentTagName?: string;
  ancestorTags: string[];
  parentKey?: number;
  mapKey?: number;
  hasRole: boolean;
  hasAria: boolean;
  hasId: boolean;
  hasData: boolean;
  hasDataState: boolean;
  hasEventHandler: boolean;
  hasSpread: boolean;
  isSemanticTag: boolean;
};

type Diagnostic = {
  score: number;
  message: string;
};

type NearDuplicateOptions = {
  minTokenCount: number;
  maxJaccardDistance: number;
  minOccurrences: number;
  tokenIndexSample: number;
  suppressPrefixes: string[];
  failOnViolation: boolean;
};

type LoopSiblingOptions = {
  loopMinOccurrences: number;
  siblingMinOccurrences: number;
};

type UtilityScoringOptions = {
  minUtilityTokens: number;
  scoreThreshold: number;
  semanticWeight: number;
};

type ConceptDefinition = {
  id: string;
  label: string;
  suggestion: string;
  requiredTokens: string[];
  optionalTokens?: string[];
  minOptionalMatches?: number;
  tagNames?: string[];
  ancestorTags?: string[];
  requiresDataState?: boolean;
  requiresRole?: boolean;
};

type SemanticConfigFile = {
  nearDuplicateClasses?: Partial<NearDuplicateOptions>;
  loopSiblingHints?: Partial<LoopSiblingOptions>;
  utilitySemanticScoring?: Partial<UtilityScoringOptions>;
  conceptHints?: {
    disabled?: string[];
  };
};

type LoadedConfig = {
  nearDuplicate: NearDuplicateOptions;
  loopSibling: LoopSiblingOptions;
  scoring: UtilityScoringOptions;
  disabledConcepts: Set<string>;
};

const PROJECT_ROOT = process.cwd();
const CONFIG_PATH = "tools/semantic-lint.config.json";
const DEFAULT_NEAR_DUPLICATE: NearDuplicateOptions = {
  minTokenCount: 4,
  maxJaccardDistance: 0.25,
  minOccurrences: 2,
  tokenIndexSample: 5,
  suppressPrefixes: [],
  failOnViolation: false,
};

const DEFAULT_LOOP_SIBLING: LoopSiblingOptions = {
  loopMinOccurrences: 3,
  siblingMinOccurrences: 3,
};

const DEFAULT_SCORING: UtilityScoringOptions = {
  minUtilityTokens: 8,
  scoreThreshold: 6,
  semanticWeight: 2,
};

const CONCEPT_DICTIONARY: ConceptDefinition[] = [
  {
    id: "button-like",
    label: "Button-like utility stack",
    suggestion: "Extract a .btn or .btn-primary semantic class with @apply.",
    requiredTokens: ["inline-flex", "items-center", "px-*", "py-*", "rounded-*", "bg-*"],
    optionalTokens: ["gap-*", "font-medium", "text-*", "hover:*", "focus:*"],
    minOptionalMatches: 2,
  },
  {
    id: "chip",
    label: "Chip / badge utility stack",
    suggestion: "Extract a .chip or .badge semantic class with @apply.",
    requiredTokens: ["inline-flex", "items-center", "rounded-full", "px-*", "py-*", "text-xs"],
    optionalTokens: ["gap-*", "border", "border-*", "font-medium"],
    minOptionalMatches: 1,
  },
  {
    id: "card-surface",
    label: "Card surface",
    suggestion: "Extract a .card or .card__body semantic class with @apply.",
    requiredTokens: ["rounded-*", "shadow-*", "p-*", "bg-*"],
    optionalTokens: ["border", "border-*"],
    minOptionalMatches: 1,
  },
  {
    id: "toolbar",
    label: "Toolbar / horizontal control bar",
    suggestion: "Extract a .toolbar semantic class with @apply.",
    requiredTokens: ["flex", "items-center", "gap-*", "px-*"],
    optionalTokens: ["h-*", "border-b", "bg-*", "justify-between"],
    minOptionalMatches: 2,
  },
  {
    id: "tabs-trigger",
    label: "Tab trigger slot",
    suggestion: "Extract a .tabs__trigger semantic class with state-aware styles.",
    requiredTokens: ["inline-flex", "items-center", "px-*", "py-*", "border-b"],
    optionalTokens: ["text-*", "uppercase", "tracking-*"],
    minOptionalMatches: 1,
    requiresDataState: true,
  },
  {
    id: "nav-link",
    label: "Navigation link",
    suggestion: "Extract a .nav__link semantic class (plus .nav__link--active variant).",
    requiredTokens: ["inline-flex", "items-center", "gap-*", "text-*"],
    optionalTokens: ["font-medium", "hover:text-*", "focus:*"],
    minOptionalMatches: 1,
    ancestorTags: ["nav"],
  },
];

function loadConfig(): LoadedConfig {
  const raw = readFileSync(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw) as SemanticConfigFile;
  const nearDuplicate = {
    ...DEFAULT_NEAR_DUPLICATE,
    ...(parsed.nearDuplicateClasses ?? {}),
  };
  const loopSibling = {
    ...DEFAULT_LOOP_SIBLING,
    ...(parsed.loopSiblingHints ?? {}),
  };
  const scoring = {
    ...DEFAULT_SCORING,
    ...(parsed.utilitySemanticScoring ?? {}),
  };
  const disabledConcepts = new Set<string>(parsed.conceptHints?.disabled ?? []);
  return {
    nearDuplicate,
    loopSibling,
    scoring,
    disabledConcepts,
  };
}

function globPaths(pattern: string): string[] {
  const glob = new Bun.Glob(pattern);
  return Array.from(glob.scanSync(PROJECT_ROOT));
}

function shouldSuppress(tokens: string[], prefixes: string[]): boolean {
  if (prefixes.length === 0) return false;
  return tokens.every((token) => prefixes.some((prefix) => token.startsWith(prefix)));
}

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function getTagName(node: ts.JsxOpeningLikeElement): string {
  const tag = node.tagName;
  if (ts.isIdentifier(tag)) return tag.text;
  return tag.getText();
}

function describeParent(node: ts.Node | undefined): { tag?: string; key?: number } {
  if (!node) return {};
  if (ts.isJsxElement(node)) {
    return { tag: getTagName(node.openingElement), key: node.getStart() };
  }
  if (ts.isJsxFragment(node)) {
    return { tag: "fragment", key: node.getStart() };
  }
  return {};
}

function findAncestorMapCall(node: ts.Node | undefined): ts.CallExpression | undefined {
  let current = node;
  while (current) {
    if (ts.isCallExpression(current) && ts.isPropertyAccessExpression(current.expression)) {
      const access = current.expression;
      if (access.name.text === "map") {
        return current;
      }
    }
    current = current.parent;
  }
  return undefined;
}

function collectAncestorTags(node: ts.Node | undefined): string[] {
  const tags: string[] = [];
  let current = node;
  while (current) {
    if (ts.isJsxElement(current)) {
      tags.push(getTagName(current.openingElement).toLowerCase());
    } else if (ts.isJsxSelfClosingElement(current)) {
      tags.push(getTagName(current).toLowerCase());
    } else if (ts.isJsxFragment(current)) {
      tags.push("fragment");
    }
    current = current.parent;
  }
  return tags;
}

function collectElementContext(attribute: ts.JsxAttribute): ElementContext {
  const attributes = attribute.parent;
  const parentNode = attributes?.parent;
  if (!parentNode) {
    return {
      tagName: "unknown",
      ancestorTags: [],
      hasRole: false,
      hasAria: false,
      hasId: false,
      hasData: false,
      hasDataState: false,
      hasEventHandler: false,
      hasSpread: false,
      isSemanticTag: false,
    };
  }

  let openingElement: ts.JsxOpeningLikeElement | undefined;
  let elementNode: ts.Node | undefined;
  if (ts.isJsxOpeningElement(parentNode)) {
    openingElement = parentNode;
    elementNode = parentNode.parent;
  } else if (ts.isJsxSelfClosingElement(parentNode)) {
    openingElement = parentNode;
    elementNode = parentNode;
  }

  if (!openingElement) {
    return {
      tagName: "unknown",
      ancestorTags: [],
      hasRole: false,
      hasAria: false,
      hasId: false,
      hasData: false,
      hasDataState: false,
      hasEventHandler: false,
      hasSpread: false,
      isSemanticTag: false,
    };
  }

  const tagName = getTagName(openingElement);
  let hasRole = false;
  let hasAria = false;
  let hasId = false;
  let hasData = false;
  let hasDataState = false;
  let hasEventHandler = false;
  let hasSpread = false;

  for (const prop of openingElement.attributes.properties) {
    if (ts.isJsxAttribute(prop)) {
      const name = prop.name.text;
      if (name === "role") hasRole = true;
      if (name === "id") hasId = true;
      if (name.startsWith("aria-")) hasAria = true;
      if (name.startsWith("data-")) {
        hasData = true;
        if (name === "data-state") hasDataState = true;
      }
      if (name.length > 2 && name.startsWith("on") && name[2] === name[2]?.toUpperCase()) {
        hasEventHandler = true;
      }
    } else if (ts.isJsxSpreadAttribute(prop)) {
      hasSpread = true;
    }
  }

  const elementContextNode = elementNode ?? openingElement;
  const parentInfo = describeParent(elementContextNode.parent);
  const mapCall = findAncestorMapCall(elementContextNode);
  const ancestorTags = collectAncestorTags(elementContextNode.parent).filter(Boolean);
  const isSemanticTag = !["div", "span"].includes(tagName.toLowerCase());

  return {
    tagName,
    parentTagName: parentInfo.tag,
    ancestorTags,
    parentKey: parentInfo.key,
    mapKey: mapCall?.getStart(),
    hasRole,
    hasAria,
    hasId,
    hasData,
    hasDataState,
    hasEventHandler,
    hasSpread,
    isSemanticTag,
  };
}

function normalizeClassString(
  raw: string,
  filePath: string,
  loc: Location,
  suppressPrefixes: string[],
  context: ElementContext,
): NormalizedClass | null {
  const tokens = raw.split(/\s+/).map(normalizeToken).filter(Boolean);
  if (tokens.length === 0) return null;
  const uniqueTokens = Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b));
  if (shouldSuppress(uniqueTokens, suppressPrefixes)) {
    return null;
  }
  return {
    filePath,
    location: loc,
    raw,
    tokens: uniqueTokens,
    tokenSet: new Set(uniqueTokens),
    signature: uniqueTokens.join(" "),
    context,
  };
}

function extractStringLiteral(initializer: ts.JsxAttributeValue): string | null {
  if (ts.isStringLiteral(initializer)) {
    return initializer.text;
  }
  if (ts.isJsxExpression(initializer) && initializer.expression) {
    const expr = initializer.expression;
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
      return expr.text;
    }

    if (ts.isTemplateExpression(expr)) {
      const head = expr.head.text;
      const spans = expr.templateSpans;
      const reconstructed: string[] = [head];
      for (const span of spans) {
        if (
          ts.isStringLiteral(span.expression) ||
          ts.isNoSubstitutionTemplateLiteral(span.expression)
        ) {
          reconstructed.push(span.expression.text, span.literal.text);
          continue;
        }
        return null;
      }
      return reconstructed.join("");
    }

    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
      const callee = expr.expression.text;
      if (callee === "clsx" || callee === "classnames" || callee === "cn") {
        const literals: string[] = [];
        for (const arg of expr.arguments) {
          if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
            literals.push(arg.text);
          } else if (ts.isArrayLiteralExpression(arg)) {
            for (const el of arg.elements) {
              if (ts.isStringLiteral(el)) literals.push(el.text);
            }
          } else if (ts.isObjectLiteralExpression(arg)) {
            for (const prop of arg.properties) {
              if (
                ts.isPropertyAssignment(prop) &&
                (ts.isStringLiteral(prop.name) || ts.isIdentifier(prop.name))
              ) {
                if (
                  ts.isStringLiteral(prop.initializer) ||
                  ts.isNoSubstitutionTemplateLiteral(prop.initializer)
                ) {
                  literals.push(prop.name.text ?? prop.name.getText());
                }
              }
            }
          } else {
            return null;
          }
        }
        return literals.join(" ").trim();
      }
    }
  }
  return null;
}

function extractClassesFromTsx(filePath: string, suppressPrefixes: string[]): NormalizedClass[] {
  const sourceText = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const results: NormalizedClass[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxAttribute(node) && node.name.text === "className" && node.initializer) {
      const raw = extractStringLiteral(node.initializer);
      if (raw) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const norm = normalizeClassString(
          raw,
          filePath,
          { line: line + 1, column: character + 1 },
          suppressPrefixes,
          collectElementContext(node),
        );
        if (norm) results.push(norm);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return results;
}

function jaccardDistance(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  if (union === 0) return 0;
  return 1 - intersection / union;
}

function buildIndex(entries: NormalizedClass[], sample: number): Map<string, number[]> {
  const map = new Map<string, number[]>();
  entries.forEach((entry, index) => {
    const baseTokens = entry.tokens.slice(0, sample);
    for (const token of baseTokens) {
      const key = token;
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(index);
      } else {
        map.set(key, [index]);
      }
    }
  });
  return map;
}

function uniqueCandidates(
  index: Map<string, number[]>,
  entry: NormalizedClass,
  sample: number,
  selfIndex: number,
): number[] {
  const candidateSet = new Set<number>();
  const tokens = entry.tokens.slice(0, sample);
  for (const token of tokens) {
    const bucket = index.get(token);
    if (!bucket) continue;
    for (const idx of bucket) {
      if (idx === selfIndex) continue;
      candidateSet.add(idx);
    }
  }
  return Array.from(candidateSet);
}

function selectAnchor(entries: NormalizedClass[]): NormalizedClass {
  return entries.reduce((current, candidate) => {
    if (!current) return candidate;
    if (candidate.filePath < current.filePath) return candidate;
    if (candidate.filePath > current.filePath) return current;
    if (candidate.location.line < current.location.line) return candidate;
    if (candidate.location.line > current.location.line) return current;
    if (candidate.location.column < current.location.column) return candidate;
    return current;
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function createNearDuplicateDiagnostics(
  entries: NormalizedClass[],
  config: NearDuplicateOptions,
): Diagnostic[] {
  const filtered = entries.filter((entry) => entry.tokens.length >= config.minTokenCount);
  if (filtered.length === 0) return [];

  const index = buildIndex(filtered, config.tokenIndexSample);
  const seenPairs = new Set<string>();
  const unions = new UnionFind(filtered.length);
  const pairDistances = new Map<string, number>();
  const pairMembers = new Map<string, [number, number]>();

  filtered.forEach((entry, idx) => {
    const candidates = uniqueCandidates(index, entry, config.tokenIndexSample, idx);
    for (const candidateIdx of candidates) {
      if (candidateIdx <= idx) continue;
      const other = filtered[candidateIdx];
      const key = `${idx}:${candidateIdx}`;
      if (seenPairs.has(key)) continue;
      const distance = jaccardDistance(entry.tokenSet, other.tokenSet);
      if (distance <= config.maxJaccardDistance) {
        seenPairs.add(key);
        unions.union(idx, candidateIdx);
        pairDistances.set(key, distance);
        pairMembers.set(key, [idx, candidateIdx]);
      }
    }
  });

  const groups = new Map<number, { members: number[]; distances: number[] }>();
  pairDistances.forEach((distance, key) => {
    const members = pairMembers.get(key);
    if (!members) return;
    const root = unions.find(members[0]);
    if (!groups.has(root)) groups.set(root, { members: [], distances: [] });
    const group = groups.get(root);
    if (!group) return;
    group.distances.push(distance);
    group.members.push(...members);
  });

  const results: Diagnostic[] = [];
  groups.forEach((group) => {
    const uniqueIndices = Array.from(new Set(group.members));
    if (uniqueIndices.length < config.minOccurrences) return;
    const anchor = selectAnchor(uniqueIndices.map((index) => filtered[index]));
    const similarity = 1 - average(group.distances);
    const percentage = (similarity * 100).toFixed(0);
    const header = `${relative(PROJECT_ROOT, anchor.filePath)}:${anchor.location.line}:${anchor.location.column} near-duplicate class strings (~${percentage}% overlap)`;
    const bulletLines = uniqueIndices
      .slice(0, 5)
      .map((idx) => {
        const entry = filtered[idx];
        const file = relative(PROJECT_ROOT, entry.filePath);
        return `  • ${file}:${entry.location.line}:${entry.location.column} → ${entry.raw}`;
      })
      .join("\n");
    const suffix = uniqueIndices.length > 5 ? `\n  • …and ${uniqueIndices.length - 5} more` : "";
    const score = similarity ** 2 * uniqueIndices.length;
    results.push({
      score,
      message: `${header}\n${bulletLines}${suffix}\nConsider extracting a shared semantic class (e.g. add an @apply definition in semantic.css).`,
    });
  });

  return results;
}

function normalizeNameForSuggestion(source: string | undefined): string {
  if (!source) return "slot";
  const cleaned = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned.length === 0 ? "slot" : cleaned;
}

function createLoopSiblingDiagnostics(
  entries: NormalizedClass[],
  config: LoopSiblingOptions,
): Diagnostic[] {
  const results: Diagnostic[] = [];
  const loopGroups = new Map<string, NormalizedClass[]>();

  entries.forEach((entry) => {
    if (entry.context.mapKey === undefined) return;
    const key = `${entry.context.mapKey}:${entry.signature}`;
    const list = loopGroups.get(key);
    if (list) {
      list.push(entry);
    } else {
      loopGroups.set(key, [entry]);
    }
  });

  loopGroups.forEach((list) => {
    if (list.length < config.loopMinOccurrences) return;
    const anchor = selectAnchor(list);
    const file = relative(PROJECT_ROOT, anchor.filePath);
    const parentTag = normalizeNameForSuggestion(list[0].context.parentTagName ?? "loop");
    const utilities = list[0].tokens.join(" ");
    const message = `${file}:${anchor.location.line}:${anchor.location.column} map()-generated elements share identical utility stack (${list.length} items)\n  • parent: ${parentTag}\n  • utilities: ${utilities}\nSuggestion: Extract a semantic child class (e.g. .${parentTag}__item) or lift shared layout into the container.`;
    const score = list.length * list[0].tokens.length;
    results.push({ score, message });
  });

  const siblingGroups = new Map<string, NormalizedClass[]>();
  entries.forEach((entry) => {
    if (entry.context.mapKey !== undefined) return;
    if (entry.context.parentKey === undefined) return;
    const key = `${entry.context.parentKey}:${entry.signature}`;
    const list = siblingGroups.get(key);
    if (list) {
      list.push(entry);
    } else {
      siblingGroups.set(key, [entry]);
    }
  });

  siblingGroups.forEach((list) => {
    if (list.length < config.siblingMinOccurrences) return;
    const anchor = selectAnchor(list);
    const file = relative(PROJECT_ROOT, anchor.filePath);
    const parentTag = normalizeNameForSuggestion(list[0].context.parentTagName ?? "fragment");
    const utilities = list[0].tokens.join(" ");
    const message = `${file}:${anchor.location.line}:${anchor.location.column} sibling elements reuse the same utility stack (${list.length} matches)\n  • parent: ${parentTag}\n  • utilities: ${utilities}\nSuggestion: Extract a named slot class (e.g. .${parentTag}__item) with @apply and reuse it.`;
    const score = list.length * list[0].tokens.length;
    results.push({ score, message });
  });

  return results;
}

function matchesTokenSpec(token: string, spec: string): boolean {
  if (spec.endsWith("*")) {
    return token.startsWith(spec.slice(0, -1));
  }
  return token === spec;
}

function tokenSetHas(tokens: string[], spec: string): boolean {
  return tokens.some((token) => matchesTokenSpec(token, spec));
}

function countTokenMatches(tokens: string[], specs: string[] | undefined): number {
  if (!specs || specs.length === 0) return 0;
  return specs.reduce((count, spec) => (tokenSetHas(tokens, spec) ? count + 1 : count), 0);
}

function conceptMatches(entry: NormalizedClass, concept: ConceptDefinition): boolean {
  const tokens = entry.tokens;
  if (!concept.requiredTokens.every((spec) => tokenSetHas(tokens, spec))) {
    return false;
  }

  if (concept.optionalTokens) {
    const matches = countTokenMatches(tokens, concept.optionalTokens);
    if ((concept.minOptionalMatches ?? 0) > matches) {
      return false;
    }
  }

  if (concept.tagNames) {
    const lowerTag = entry.context.tagName.toLowerCase();
    if (!concept.tagNames.some((tag) => tag.toLowerCase() === lowerTag)) {
      return false;
    }
  }

  if (concept.ancestorTags) {
    const ancestorLower = entry.context.ancestorTags.map((tag) => tag.toLowerCase());
    if (!concept.ancestorTags.some((tag) => ancestorLower.includes(tag.toLowerCase()))) {
      return false;
    }
  }

  if (concept.requiresDataState && !entry.context.hasDataState) {
    return false;
  }

  if (concept.requiresRole && !entry.context.hasRole) {
    return false;
  }

  return true;
}

function createConceptDiagnostics(
  entries: NormalizedClass[],
  disabledConcepts: Set<string>,
): Diagnostic[] {
  const results: Diagnostic[] = [];
  const seen = new Set<string>();

  entries.forEach((entry) => {
    for (const concept of CONCEPT_DICTIONARY) {
      if (disabledConcepts.has(concept.id)) continue;
      if (!conceptMatches(entry, concept)) continue;
      const key = `${concept.id}:${entry.filePath}:${entry.location.line}:${entry.location.column}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const file = relative(PROJECT_ROOT, entry.filePath);
      const message = `${file}:${entry.location.line}:${entry.location.column} ${concept.label}\n  • ${entry.raw}\n${concept.suggestion}`;
      const score =
        entry.tokens.length +
        concept.requiredTokens.length * 2 +
        (concept.optionalTokens?.length ?? 0);
      results.push({ score, message });
    }
  });

  return results;
}

function computeSemanticSignals(context: ElementContext): number {
  let score = 0;
  if (context.isSemanticTag) score += 2;
  if (context.hasRole) score += 3;
  if (context.hasAria) score += 1;
  if (context.hasId) score += 1;
  if (context.hasData) score += 1;
  if (context.hasDataState) score += 1;
  if (context.hasEventHandler) score += 1;
  if (context.hasSpread) score += 1;
  if (
    context.parentTagName &&
    !["div", "span", "fragment"].includes(context.parentTagName.toLowerCase())
  ) {
    score += 1;
  }
  return score;
}

function createUtilityScoringDiagnostics(
  entries: NormalizedClass[],
  config: UtilityScoringOptions,
): Diagnostic[] {
  const results: Diagnostic[] = [];
  entries.forEach((entry) => {
    const utilityTokens = entry.tokens.length;
    if (utilityTokens < config.minUtilityTokens) return;
    const semanticSignals = computeSemanticSignals(entry.context);
    const adjustedSemantics = semanticSignals * config.semanticWeight;
    const score = utilityTokens - adjustedSemantics;
    if (score < config.scoreThreshold) return;
    const file = relative(PROJECT_ROOT, entry.filePath);
    const tagSuggestion = normalizeNameForSuggestion(entry.context.tagName);
    const message = `${file}:${entry.location.line}:${entry.location.column} heavy utility stack with limited semantics\n  • utilities: ${utilityTokens}\n  • semantic signals: ${semanticSignals} (weight ${config.semanticWeight})\nSuggestion: Name this element (e.g. .${tagSuggestion}-slot) or add role/aria landmarks before layering utilities.`;
    results.push({ score, message });
  });
  return results;
}

function main(): void {
  const config = loadConfig();
  const tsxFiles = globPaths("src/**/*.tsx");
  const entries: NormalizedClass[] = [];
  for (const file of tsxFiles) {
    entries.push(...extractClassesFromTsx(file, config.nearDuplicate.suppressPrefixes));
  }

  if (entries.length === 0) return;

  const diagnostics: Diagnostic[] = [];
  diagnostics.push(...createNearDuplicateDiagnostics(entries, config.nearDuplicate));
  diagnostics.push(...createLoopSiblingDiagnostics(entries, config.loopSibling));
  diagnostics.push(...createConceptDiagnostics(entries, config.disabledConcepts));
  diagnostics.push(...createUtilityScoringDiagnostics(entries, config.scoring));

  diagnostics
    .sort((a, b) => b.score - a.score)
    .forEach((diagnostic) => {
      console.error(diagnostic.message);
    });

  if (diagnostics.length > 0 && config.nearDuplicate.failOnViolation) {
    process.exitCode = 1;
  }
}

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX] += 1;
    }
  }
}

main();
