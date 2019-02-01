// Initializes the `favorite` service on path `/favorite`
const createService = require('./favorite.class.js');
const hooks = require('./favorite.hooks');
const articleResponse = require('../../middleware/article-response');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/favorite', createService(options));


  // re-export the posts service on the /users/:userId/posts route
  app.use('/articles/:slug/favorite', app.service('favorite'),articleResponse);

  // A hook that updates `data` with the route parameter
  function mapSlugToData(context) {
    if(context.data && context.params.route.slug) {
      context.data.slug = context.params.route.slug;
    }
  }

  // For the new route, map the `:userId` route parameter to the query in a hook
  app.service('articles/:slug/favorite').hooks({
    before: {
      find(context) {
        context.params.query.slug = context.params.route.slug;
      },
      create: mapSlugToData,
      remove: mapSlugToData
    }
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('favorite');
  service.setup(app);

  service.hooks(hooks);
};
