# Redux State Container (X)

When designing React apps, UI state becomes an important concern. How state is managed
across your component hierarchy during your app lifecycle gets complex fast as
the number of components and user interactions increase.

Regression testing becomes really important for such
apps, when you refactor or add new features, you want to ensure various permutations
and combinations of state within your component hierarchy remains consistent.

Fortunately Facebook has already thought this through for us. They have introduced
to the open source, [Flux application architecture][3] for building user interfaces.

A> Flux is the application architecture that Facebook uses for building client-side web applications.
A> It complements React's composable view components by utilizing a unidirectional data flow.
A> It's more of a pattern rather than a formal framework...
A> Flux applications have three major parts: the dispatcher, the stores, and the views (React components).
A> -- http://facebook.github.io/flux/

Another Facebook contribution to the open source is [Immutable.js][1] which provides
immutable and persistent data collections for JavaScript. Immutability is an important
design pattern introduced in ES6 and many modern programming languages. It goes hand-in-hand
with multi-component state management in a simple and efficient manner.

Redux is a very popular library in the React ecosystem.
It evolves from Flux design patterns and is based on [Elm architecture][2] which is a simple
pattern for infinitely nested components. This chapter implements Redux and Immutable.js
along with behavior-driven development using Mocha, Chai, and Enzyme
introduced in the **Test App Components** chapter.

{pagebreak}

## The Roadmap app

To help understand this important chapter, let us create a relatively complex app
to manage the the roadmap for ReactSpeed book and companion code. We want to list
upcoming, recent content and code features. Users should have the capability
to *Like* features they want to see first or jump to live feature demos and content.

![Roadmap app wireframe](images/roadmap.jpg)

Our roadmap app will require a Feature component to render the individual feature.
It will also require a FeatureList component to manage list of feature components. We will
add a FeatureSearch component to search listed features.
A CategoryFilter component will list features by categories like
components, styles, chapters, sections, and strategies.

You will note that various components within this app will interact with each
other (blue dashed lines in the wireframe). Changing filters will interact with search,
reducing the scope of what can be searched. Search will interact with features, showing only features
that match the text entered in search. Number of likes will interact with order of features.

Our app will also maintain several UI states. Some candidate states could be,
active filter, order of features, search text, and last *Like* clicked.

## Formal specification

Let us formalize the specification for our Roadmap app using the BDD test environment
we setup using **Test App Components** chapter.

For this we will use Mocha only to start with and specify our component hierarchy
as a to-be-implemented test suite.

{title="03_roadmap.spec.js", lang=javascript}
~~~~~~~
import { describe, it } from 'mocha';

describe('<Roadmap />', () => {
  it('should create one .roadmap component');

  describe('<SearchFilter />', () => {
    it('should create one .search-filter component');

    describe('<FeatureSearch />', () => {
      it('should create one .feature-search component');
    });

    describe('<CategoryFilter />', () => {
      it('should create N .category-filter components');
    });
  });

  describe('<FeatureList />', () => {
    it('should create one .feature-list component');

    describe('<Feature />', () => {
      it('should create N .feature components');

      describe('<Category />', () => {
        it('should create one .category component per .feature');
      });

      describe('<Likes />', () => {
        it('should create one .likes component per .feature');
      });

      describe('<FeatureDetail />', () => {
        it('should create one .feature-detail component per .feature');
      });
    });
  });
});
~~~~~~~

When we run this test using ```npm run test``` we notice following test results.

{title="Terminal output running Roadmap test suite", lang=text}
~~~~~~~
...

  <Roadmap />
    - should create one .roadmap component
    <SearchFilter />
      - should create one .search-filter component
      <FeatureSearch />
        - should create one .feature-search component
      <CategoryFilter />
        - should create N .category-filter components
    <FeatureList />
      - should create one .feature-list component
      <Feature />
        - should create N .feature components
        <Category />
          - should create one .category component per .feature
        <Likes />
          - should create one .likes component per .feature
        <FeatureDetail />
          - should create one .feature-detail component per .feature


  9 passing (144ms)
  12 pending
~~~~~~~

{pagebreak}

## State tree definition

Now that we have a formal spec for our component hierarchy, let us define the
state tree required for our app.

A quick way to define this is in the form of a JSON objects at different
states of the application-data lifecycle.

When we start out, our features are listed under ```proposed``` flag.

{title="Roadmap state tree, proposed", lang=json}
~~~~~~~
{
  proposed: [
    { feature: 'Navigation', likes: 0 },
    { feature: 'Redux state container', likes: 0 },
    { feature: 'Card', likes: 0 }
  ],
  trending: [],
  live: []
}
~~~~~~~

As our users ```like``` the features, these change to ```trending``` flag.

{title="Roadmap state tree, trending", lang=json}
~~~~~~~
{
  proposed: [
    { feature: 'Redux state container', likes: 0 }
  ],
  trending: [
    { feature: 'Navigation', likes: 3 },
    { feature: 'Card', likes: 1 }
  ],
  live: []
}
~~~~~~~

As these features go live we change to ```live``` flag.

{title="Roadmap state tree, live", lang=json}
~~~~~~~
{
  proposed: [],
  trending: [
    { feature: 'Card', likes: 3 },
    { feature: 'Redux state container', likes: 2 }
  ],
  live: [
    { feature: 'Navigation', likes: 1 },
  ]
}
~~~~~~~

We can continue to evolve our state tree by adding other states for our app. We
can add states for handling FeatureSearch text that user enters. We can also
add state for CategoryFilter that user has selected. At this point we refactor
our state tree to add feature id to handle data reference.

{title="Roadmap state tree, search", lang=json}
~~~~~~~
{
  proposed: [],
  trending: [
    { id: 2, feature: 'Card', likes: 3 },
    { id: 1, feature: 'Redux state container', likes: 2 }
  ],
  live: [
    { id: 3, feature: 'Navigation', likes: 1 },
  ],
  featureSearch: 'Nav',
  search: [3]
}
~~~~~~~

We refactor our state tree for category to add CategoryFilter and features list
with feature id reference for all other lists.

{title="Roadmap state tree, CategoryFilter", lang=json}
~~~~~~~
{
  features: [
    { id: 1, feature: 'Redux state container', category: 'chapter', likes: 2 },
    { id: 2, feature: 'Card', category: 'component' likes: 3 },
    { id: 3, feature: 'Navigation', category: 'component', likes: 1 }
  ],
  proposed: [],
  trending: [2, 1],
  live: [3],
  featureSearch: 'Nav',
  search: [3],
  categoryFilter: 'component',
  category: [2, 3]
}
~~~~~~~

{pagebreak}

## Data structure definition




I> ## Chapter In Progress
I> We are still writing this chapter. Please watch this space for updates.
I> Plan is to add working samples to explain how Redux predictable state container
I> makes our app architecture more robust.

[1]: https://github.com/facebook/immutable-js
[2]: http://guide.elm-lang.org/architecture/index.html
[3]: http://facebook.github.io/flux/