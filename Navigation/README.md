```
makeNavigation({
  has: [
    makeLinkList(Cycle({ View: () => 'ga' })),
    makeLinkList([{ href: 'bu', has: 'bu' }]),
    [Cycle({ View: () => 'bu' })],
    Cycle({ View: () => 'zo' }),
    {
      has: Cycle({ View: () => 'meu' })
    },
    {
      has: { href: 'gna', has: Cycle({ View: () => 'gna' }) }
    },
    {
      has: { href: 'pwet', has: 'pwet' }
    },
    {
      has: [
        { href: 'zwip', has: 'zwip' },
        { href: 'piwz', has: 'piwz' },
      ]
    },
  ]
})
```

should produce

```
<nav class="Navigation">
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route">ga</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route/bu">bu</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route">bu</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route">zo</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route">meu</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route/gna">gna</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route/pwet">pwet</a></li>
    </ul>
    <ul class="LinkList">
        <li class="Item"><a class="Link" href="/route/zwip">zwip</a></li>
        <li class="Item"><a class="Link" href="/route/piwz">piwz</a></li>
    </ul>
</nav>
```