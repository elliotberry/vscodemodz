/*export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.FunctionDeclaration).forEach(path => {
    const { node } = path;
    const functionName = node.id.name;
    const functionExpression = j.functionExpression(null, node.params, node.body, node.generator, node.async);
    const constDeclaration = j.variableDeclaration("const", [
      j.variableDeclarator(j.identifier(functionName), functionExpression),
    ]);

    j(path).replaceWith(constDeclaration);
  });

  return root.toSource();
}*/

module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.FunctionDeclaration)
    .forEach(path => {
      const funcName = path.node.id.name;
      const funcParams = path.node.params;
      const funcBody = path.node.body;

      let newFunc;

      // Handle async functions
      if (path.node.async) {
        newFunc = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(funcName),
            j.arrowFunctionExpression(funcParams, funcBody, true) // true for async
          )
        ]);
      } else {
        newFunc = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(funcName),
            j.functionExpression(null, funcParams, funcBody)
          )
        ]);
      }

      j(path).replaceWith(newFunc);
    });

  return root.toSource();
};

