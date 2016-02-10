
(function(module){
function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
  // is the transformation of one colleciton into another.
  // rawData.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
// DONE: Refactor this function, so it accepts an argument of a callback function (likely a view function)
// to execute once the loading of articles is done.
Article.fetchAll = function(viewInit) {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    viewInit();

  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      viewInit();
    });
  }
};
// DONE: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    return article.body.match(/\b\w+/g).length // Get the total number of words in this article
  })
  .reduce(function(a, b) {
    return a + b; // Sum up all the values in the collection
  })
};

// DONE: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
  return Article.all.map(function(Article) {
    return Article.author;
  })// Don't forget to read the docs on map and reduce!
  .reduce(function(preVal, currVal) {
    if(preVal.indexOf(currVal) === -1) {
      preVal.push(currVal);
    }
    return preVal;
  },[]);
};

Article.numWordsByAuthor = function() {
  return Article.allAuthors().map(function(author) {
    return {
      // someKey: someValOrFunctionCall().map(...).reduce(...), ...
      name: author,
      numWords:Article.all.map(function(article){
        if (article.author === author){
          return article.body.match(/\b\w+/g).length
        } else {
          return 0;
        }
      })
      .reduce(function(x,y){
        return x + y;
      })
    };
  })
}
module.Article = Article;
}(window));
