'use strict'

describe('[integration] coverage maximum', function () {
  it('should call NotGoodName handler', function (done) {
    require('./bads/NotGoodName')()
    done()
  })
})
