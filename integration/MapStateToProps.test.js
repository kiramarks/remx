import _ from 'lodash';
import React, { Component } from 'react';
import renderer from 'react-test-renderer';

const mobxReact = require('mobx-react/native');
const connect = require('../src/connect').connect(mobxReact.observer);

describe('connect with mapStateToProps', () => {
  let MyComponent;
  let store;
  let renderSpy;

  beforeEach(() => {
    store = require('./Store');
    MyComponent = require('./MapStateToPropsComp').default;
    renderSpy = jest.fn();
  });

  it('defensive coding', () => {
    expect(connect({})).toBeDefined();
  });

  it('connected component behaves normally', () => {
    const mapStateToProps = (ownProps) => {
      return {};
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} textToRender="hello" />);
    expect(tree.toJSON().children).toEqual(['hello']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('object will be injected to props', () => {
    const mapStateToProps = (ownProps) => {
      return {
        textToRender: 'Hello, World!'
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['Hello, World!']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  xit('wraps with observer that listens on props', () => {
    const mapStateToProps = (ownProps) => {
      return {
        textToRender: store.getters.getName()
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName('my name');
    expect(tree.toJSON().children).toEqual(['my name']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});
