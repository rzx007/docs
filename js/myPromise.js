/* 
  手写promise，暂无then的链式调用
*/

class myPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';
  constructor(func) {
    this.PromiseState = myPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfiledCallback = [];
    this.onRejectedCallback = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error)
    }
  }
  resolve(result) {
    if (this.PromiseState === myPromise.PENDING) {
      setTimeout(() => {
        this.PromiseState = myPromise.FULFILLED;
        this.PromiseResult = result;
        this.onFulfiledCallback.forEach(callback => {
          callback(result);
        })
      });
    }
  }
  reject(reason) {
    if (this.PromiseState === myPromise.PENDING) {
      setTimeout(() => {
        this.PromiseState = myPromise.REJECTED
        this.PromiseResult = reason;
        this.onRejectedCallback.forEach(callback => {
          callback(reason);
        })
      });
    }
  }
  then(onFulfiled, onRejected) {
    onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : value => value;
    onRejected = typeof onFulfiled === 'function' ? onFulfiled : value => { throw value; };

    if (this.PromiseState === myPromise.PENDING) {
      this.onFulfiledCallback.push(onFulfiled)
      this.onRejectedCallback.push(onRejected)
    }
    if (this.PromiseState === myPromise.FULFILLED) {
      setTimeout(() => {
        onFulfiled(this.PromiseResult)
      })
    }
    if (this.PromiseState === myPromise.REJECTED) {
      setTimeout(() => {
        onRejected(this.PromiseResult)
      })

    }
  }
  catch(onRejected) {
    this.then(null, onRejected)
  }
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    console.log('A', promise1.PromiseState);
    resolve('这次一定');
    console.log('B', promise1.PromiseState);
    console.log(4);
  });
})
promise1.then(
  result => {
    console.log('C', promise1.PromiseState);
    console.log('fulfilled:', result);
  },
  reason => {
    console.log('rejected:', reason)
  }
)
console.log(3);
promise1.then(res => {
  console.log('resolve', res);
})