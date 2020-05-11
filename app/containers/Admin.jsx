import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SizeMap } from '../components/SizeMap';
import fetchWP from '../utils/fetchWP';
import {
  createStore,
  action,
  StoreProvider,
  useStoreActions,
} from 'easy-peasy';

import { SW_SIZES } from '../utils/sizes';

import { cloneDeep, find, each } from 'lodash';

import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import '../../assets/css/board.css';
import '../../assets/css/override.css';

const store = createStore({
  mappings: {
    items: [],
    set: action((state, payload) => {
      state.items = payload;
    }),
    update: action((state, payload) => {
      const key = payload.key;
      const idx = payload.idx;
      const item = payload.item;

      const mappings = state.items;

      const target = find(mappings, (mapping) => mapping.SWSIZE_ID === key);
      target.VALUES.splice(idx, 1, item);

      state.items = mappings;
    }),
  },
  sizes: {
    items: [],
    set: action((state, payload) => {
      state.items = payload;
    }),
  },
  toast: {
    show: false,
    set: action((state, payload) => {
      state.show = payload;
    }),
  },
});

export const Admin = (props) => {
  const [loading, setLoading] = useState(true);
  const setSizes = useStoreActions((actions) => actions.sizes.set);
  const setMappings = useStoreActions((actions) => actions.mappings.set);

  const api = new fetchWP({
    restURL: props.wpObject.api_url,
    restNonce: props.wpObject.api_nonce,
  });

  useEffect(() => {
    // const self = this;
    // this.fetchWP
    //   .get('sizes')
    //   .then((result) => {
    //     return self.setState({ result: result });
    //   })
    //   .then(() => {
    //     this.fetchWP.get('mapping').then((data) => {
    //       return self.setState({ mappings: data.mapping, loading: false })
    //     });
    //   });

    const getSizes = api.get('sizes');
    const getMappings = api.get('mapping');

    Promise.all([getSizes, getMappings]).then(([{ sizes }, { mapping }]) => {
      setSizes(sizes);

      // Reconstruct mappings from database
      // provided to us from props.mappings
      // props.mappings is a flat array of mappings from the database [{}, {}, {}, ...]

      const board = cloneDeep(SW_SIZES);

      each(mapping, (data) => {
        const target = find(
          board,
          (col) => col.SWSIZE_ID === data.size_category
        );
        target.VALUES.push({
          SWSIZE_ID: data.size_category,
          SWSIZE_CONST: data.size_category_size_reference,
          SWSIZE_TYPE: data.size_fit === '' ? ' ' : data.size_fit,
          SWSIZE_CAT: 'euro', // TODO: this needs to be saved, or inferred somehow, it doesn't even exist yet
          ID: data.id,
          VALUE: data.size,
        });
      });

      setMappings(board);
      setLoading(false);
    });
  }, [setSizes, setMappings]);

  const loadingSpinner = (
    <div className='jd-loading-screen'>
      <div className='jd-loading-screen-spinner'>
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </div>
    </div>
  );

  const content = <SizeMap fetchWP={api} />;
  const output = loading ? loadingSpinner : content;
  return <div className='wrap'>{output}</div>;
};

export const AdminContainer = (props) => {
  return (
    <StoreProvider store={store}>
      <Admin {...props} />
    </StoreProvider>
  );
};

export default AdminContainer;

Admin.propTypes = {
  wpObject: PropTypes.object,
};

AdminContainer.propTypes = Admin.propTypes;
