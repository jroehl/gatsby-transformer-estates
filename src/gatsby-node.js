const crypto = require('crypto');
const { sanitizeDetails } = require('./utils');
const cfg = require('./config');

/**
 * Source the nodes
 * @param {object}
 * @param {object} options
 */
module.exports.onCreateNode = async (
  { node, boundActionCreators: { createNode, createParentChildLink }, loadNodeContent },
  { fields = cfg.fields, maxDimensions = cfg.maxDimensions },
) => {
  const { type } = node && node.internal ? node.internal : {};

  // We only care about specific content types.
  if (type !== 'is24Estates' && type !== 'flowfactEstates') return;

  const estate = JSON.parse(await loadNodeContent(node));

  const sanitizedDetail = sanitizeDetails(estate, fields, maxDimensions);

  const sanitizedNode = {
    ...sanitizedDetail,
    id: `${sanitizedDetail.id} >>> SANITIZED`,
    children: [],
    parent: node.id,
    internal: {
      contentDigest: crypto
        .createHash('md5')
        .update(JSON.stringify(sanitizedDetail))
        .digest('hex'),
      type: `${type}Sanitized`,
    },
  };
  createNode(sanitizedNode);
  createParentChildLink({ parent: node, child: sanitizedNode });
};
