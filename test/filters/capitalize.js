describe('Capitalize filter', function() {
  beforeEach(module('ContactList'));
  var $filter;
  beforeEach(inject( function(_$filter_) {
    $filter = _$filter_;
  }));

  beforeEach(function() {
    capitalize = $filter('capitalize');
  });

  it('capitalizes lowercase strings', function() {
    expect(capitalize('capitalize')).toEqual('Capitalize');
  });

  it('capitalizes mixed case strings', function() {
    expect(capitalize('cApItAliZe')).toEqual('Capitalize');
  });

  it('only capitalizes the first word', function() {
    expect(capitalize('brian hulette')).toEqual('Brian hulette');
  });

  it('doesnt garble white space', function() {
    expect(capitalize('brian    hulette')).toEqual('Brian    hulette');
  });
});
