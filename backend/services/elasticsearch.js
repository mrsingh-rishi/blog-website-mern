const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_HOST });

exports.indexDocument = async (index, document, update = false) => {
  try {
    if (update) {
      await client.update({
        index,
        id: document.id,
        body: { doc: document }
      });
    } else {
      await client.index({
        index,
        id: document.id,
        body: document
      });
    }
  } catch (err) {
    console.error('Elasticsearch error:', err);
  }
};

exports.searchPosts = async (query) => {
  try {
    const { body } = await client.search({
      index: 'posts',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title^3', 'content', 'tags^2']
          }
        }
      }
    });

    return body.hits.hits.map(hit => hit._source);
  } catch (err) {
    console.error('Elasticsearch search error:', err);
    return [];
  }
};