var blogsData = [
  {
    title: 'Sortie au bout du monde',
    posts: [
      {content: "Cool"},
      {content: "Ca marche"},
      {content: "C'est qu'un début"},
      {content: "Et pas un aurevoir"},
      {content: "Mes frères"}
    ]
  },
  {
    title: 'Sur le Salève',
    posts: [
      {content: "Cool"}
    ]
  }
];
Template.blogsList.helpers({
  blogs: blogsData
});
