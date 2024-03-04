export const mockState = [
  {
    key: 'app',
    editable: true,
    value: {
      _custom: {
        type: 'reactive',
        stateTypeName: 'Reactive',
        value: {
          count: {
            _custom: {
              type: 'ref',
              stateTypeName: 'Ref',
              value: 120,
            },
          },
          map: {
            _custom: {
              type: 'ref',
              stateTypeName: 'Ref',
              value: {
                _custom: {
                  displayText: 'Map',
                  fields: {
                    abstract: true,
                  },
                  readonly: true,
                  type: 'map',
                  value: {
                    a: 1,
                    b: 2,
                  },
                },

              },
            },
          },
          set: {
            _custom: {
              type: 'ref',
              stateTypeName: 'Ref',
              value: {
                _custom: {

                  displayText: 'Set[3]',
                  fields: {
                    abstract: true,
                  },
                  readonly: true,
                  type: 'set',
                  value: [1, 2, 3],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    key: 'app',
    editable: false,
    value: {
      doubledCount: 120,
    },
  },
]

export const routingState = [
  {
    key: '$route',
    editable: false,
    type: 'Routing',
    value: {
      _custom: {
        display: '/hello',
        readonly: true,
        tooltip: 'Current route',
        type: null,
        value: {
          fullPath: '/hello',
          hash: '',
          href: '/hello',
          matched: [
            {

            },
          ],
          meta: {},
          name: 'hello',
          params: {},
          path: '/hello',
          query: {},
        },
      },
    },
  },
]

export const helloComponentState = [
  {
    editable: true,
    key: 'app',
    type: 'setup',
    stateType: 'reactive',
    stateTypeName: 'Reactive',
    value: {
      $dispose: {
        _custom: {
          type: 'function',
          displayText: '<span style="opacity:.5;">function</span> ()',
          tooltipText: 'Dispose the reactive state',
        },
      },
      $id: 'app',
      $onAction: {
        _custom: {
          type: 'function',
          displayText: '<span style="opacity:.5;">function</span> ()',
          tooltipText: 'Dispose the reactive state',
        },
      },
      count: {
        _custom: {
          type: 'ref',
          stateTypeName: 'Ref',
          value: 120,
        },
      },
      map: {
        _custom: {
          type: 'ref',
          stateTypeName: 'Ref',
          value: {
            _custom: {
              displayText: 'Map',
              fields: {
                abstract: true,
              },
              readonly: true,
              type: 'map',
              value: {
                a: 1,
                b: 2,
              },
            },

          },
        },
      },
      set: {
        _custom: {
          type: 'ref',
          stateTypeName: 'Ref',
          value: {
            _custom: {

              displayText: 'Set[3]',
              fields: {
                abstract: true,
              },
              readonly: true,
              type: 'set',
              value: [1, 2, 3],
            },
          },
        },
      },
    },
  },
]
