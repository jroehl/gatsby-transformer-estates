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
  { fields = cfg.fields, maxDimensions = cfg.maxDimensions }
) => {
  const { type } = node && node.internal ? node.internal : {};

  // We only care about specific content types.
  if (type !== 'is24Estates' && type !== 'flowfactEstates') return;

  const estate = JSON.parse(await loadNodeContent(node));

  const sanitizedDetail = sanitizeDetails(estate, fields, maxDimensions);

  const content = JSON.stringify(sanitizedDetail);
  const sanitizedNode = {
    id: `${sanitizedDetail.id}x`,
    provider: type.replace('Estates', ''),
    estate: content,
    children: [],
    parent: node.id,
    internal: {
      contentDigest: crypto
        .createHash('md5')
        .update(content)
        .digest('hex'),
      type: `${type}Sanitized`,
    },
  };
  createNode(sanitizedNode);
  createParentChildLink({ parent: node, child: sanitizedNode });
};
