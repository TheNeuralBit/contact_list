describe('list to object filter', function() {
  beforeEach(module('ContactList'));
  var $filter;
  beforeEach(inject( function(_$filter_) {
    $filter = _$filter_;
  }));

  beforeEach(function() {
    listToObject = $filter('listToObject');
  });

  it('converts a simple list with default key/value', function() {
    var test_lst = [
      {key: 'a', value: 1},
      {key: 'b', value: 2},
      {key: 'c', value: 3},
    ];
    var test_obj = {keys: ['a', 'b', 'c'], data: {a: 1, b: 2, c: 3}};
    expect(listToObject(test_lst)).toEqual(test_obj);
  });

  it('converts a simple list', function() {
    var test_lst = [
      {apple: 'a', bear: 1},
      {apple: 'b', bear: 2},
      {apple: 'c', bear: 3},
    ];
    var test_obj = {keys: ['a', 'b', 'c'], data: {a: 1, b: 2, c: 3}};
    expect(listToObject(test_lst, 'apple', 'bear')).toEqual(test_obj);
  });

  it('ignores list items with bad keys', function() {
    var test_lst = [
      {apple: 'a', bear: 1},
      {apple: 'b', bear: 2},
      {orange: 'c', wolf: 3}
    ];
    var test_obj = {keys: ['a', 'b'], data: {a: 1, b: 2}};

    var tricky_test = function() { return listToObject(test_lst, 'apple', 'bear'); };
    expect(tricky_test).not.toThrow();
    expect(tricky_test()).toEqual(test_obj);
  });
});

describe('object to list filter', function() {
  beforeEach(module('ContactList'));
  var $filter;
  beforeEach(inject( function(_$filter_) {
    $filter = _$filter_;
  }));

  beforeEach(function() {
    objectToList = $filter('objectToList');
  });

  it('converts a simple object with default key/value', function() {
    var test_obj = {keys: ['a', 'b', 'c'], data: {a: 1, b: 2, c: 3}};
    var test_lst = [
      {key: 'a', value: 1},
      {key: 'b', value: 2},
      {key: 'c', value: 3},
    ];
    expect(objectToList(test_obj)).toEqual(test_lst);
  });

  describe('is inverse of list to object', function() {
    beforeEach(function() {
      listToObject = $filter('listToObject');
    });

    it('inverts perfectly with default key/value', function() {
      var test_obj = {keys: ['a', 'b', 'c'], data: {a: 1, b: 2, c: 3}};
      expect(listToObject(objectToList(test_obj))).toEqual(test_obj);
    });
  });
});
