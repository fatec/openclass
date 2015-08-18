if (Blogs.find().count() === 0) {
  Blogs.insert({
    title: 'Sortie au bout du monde',
    posts: [
      {content: "Cool"},
      {content: "Ca marche"},
      {content: "C'est qu'un début"},
      {content: "Et pas un aurevoir"},
      {content: "Mes frères"}
    ]
  });

  Blogs.insert({
    title: 'Sur le Salève',
    posts: [
      {content: "Cool"}
    ]
  });
}


