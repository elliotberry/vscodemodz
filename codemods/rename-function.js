export default ({source}, {jscodeshift}) => {
    const j = jscodeshift;

    return j(source)
        .find(j.Identifier, { name: 'oldFunction' })
        .forEach(({node}) => {
            node.name = 'newFunction';
        })
        .toSource();
};