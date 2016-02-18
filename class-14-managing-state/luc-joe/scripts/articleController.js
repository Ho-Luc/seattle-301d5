(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /*This method is fired off when an article is selected from the drop drop down by the user. Then its selected by its ID from the URL. Then articleData is a function which takes the article property of the context object and is set equal to the article. That content is then run in the next() function, which is passed into the articlesController.index. Inside the articlesController.index, articleView is passed that article and its appended to the DOM. */
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* This method is fired off when an author is selected from the drop down by the user. The author is grabbed from the URL. AuthorData is a function that gets passed articlesByAuthor, which is set equal to the articles property on the context object. Then next() is run, which is all the articlesController.index, which runs a render function in the articleView layer, to get all the articles by that author.*/
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* This method is fired when a category is selected by the user, from the drop down. The category is grabbed from the URL. Then the categoryData function is passed articlesInCategory (articles in that genre), which is set equal to the property articles to the context object. articlesController.index then gets all the articles with that category and then runs a view function to append that information to the DOM.*/
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* This method is called when the site initially loads. It grabs all the articles in the article.all array. After that, next() calls articlesController.index, which run a view function to append all the articles to the DOM.*/
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
