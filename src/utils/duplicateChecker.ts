
// Utility to identify and prevent component duplication
export const checkForDuplicates = (components: string[]) => {
  const seen = new Set();
  const duplicates = [];
  
  for (const component of components) {
    if (seen.has(component)) {
      duplicates.push(component);
    } else {
      seen.add(component);
    }
  }
  
  return duplicates;
};

// Component registry to track used components
export const componentRegistry = new Map();

export const registerComponent = (name: string, path: string) => {
  if (componentRegistry.has(name)) {
    console.warn(`Component ${name} already registered at ${componentRegistry.get(name)}`);
  }
  componentRegistry.set(name, path);
};

// Route validation utility
export const validateRoutes = (routes: { path: string; component: string }[]) => {
  const pathMap = new Map();
  const duplicatePaths = [];
  
  for (const route of routes) {
    if (pathMap.has(route.path)) {
      duplicatePaths.push({
        path: route.path,
        components: [pathMap.get(route.path), route.component]
      });
    } else {
      pathMap.set(route.path, route.component);
    }
  }
  
  return duplicatePaths;
};

// Clean up unused imports utility
export const cleanupImports = (fileContent: string) => {
  const lines = fileContent.split('\n');
  const importLines = lines.filter(line => line.trim().startsWith('import'));
  const codeLines = lines.filter(line => !line.trim().startsWith('import') && line.trim() !== '');
  
  const usedImports = importLines.filter(importLine => {
    const matches = importLine.match(/import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))/);
    if (!matches) return true;
    
    const imports = matches[1] ? matches[1].split(',').map(s => s.trim()) : 
                   matches[2] ? [matches[2]] : 
                   matches[3] ? [matches[3]] : [];
    
    return imports.some(imp => 
      codeLines.some(line => line.includes(imp))
    );
  });
  
  return [...usedImports, ...codeLines.filter(line => !line.trim().startsWith('import'))].join('\n');
};
