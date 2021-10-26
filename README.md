# counter
ab-counter.js is a simple, lightweight library which allows you to count up a target number at a specified speed with decimal and thousand separators.
It has no dependencies and could be use without any limitation. It counting up from 0 to value discribed in data-to attribute in element. You can specify 
decimal and thousend separators, time for animation and for one animation frame and selector (so you can use multiple times on site with different options). 

==========

ab-counter.js supports counting up:

* integers `1234`
* floats like `0.12`, `0,123`, `0.123456789` etc.
* formatted numbers like `1,234,567.00`, `1 234 567,00` etc.

Usage
=====

**Include**

```
<script src="ab-counter.min.js"></script>
```

**HTML**

```
<span data-to="1 234 567.89">0</span>
```

**script**

```
var counter = new abCounter({
  time: 1000
});
```

**or**

```
var counter = new abCounter({
  element: "[data-to]",
  time: 1000,
  delay: 10,
  decimalSeperator: ',',
  thousandSeparator: ' '
});
```

`element` - Element to work with (default [data-to])
`delay` - Time for one frame
`time` - The total duration of animation
`decimalSeperator` - Decimal separtor (default ',')
`thousandSeparator` - Thousand separtor (default ' ')


About
============

WWW: <a href='https://alfabravo.pl' rel='author'>ALFA BRAVO</a>

Facebook: [@alfabravopl](https://www.facebook.com/alfabravopl/)
