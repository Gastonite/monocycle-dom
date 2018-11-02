```
makeLinkList({
  has: [
    {
      href: 'world',
      has: Cycle({
        View: () => 'hello world'
      })
    }
  ]
}).isolation('hello')

```