import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SizeMap } from '../components/SizeMap';
import fetchWP from '../utils/fetchWP';
import {
  debug,
  createStore,
  action,
  StoreProvider,
  useStoreActions,
  useStoreState,
} from 'easy-peasy';

import { SW_SIZES } from '../utils/sizes';

import { cloneDeep, find, each } from 'lodash';

import querystring from 'querystring';

import { CLOTHES_CATEGORIES } from '../consts/clothes';

import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import '../../assets/css/board.css';
import '../../assets/css/override.css';

const store = createStore({
  app: {
    loading: true,
    setLoading: action((state, payload) => {
      state.loading = payload
    })
  },
  location: {
    category: CLOTHES_CATEGORIES[0],
    set: action((state, payload) => {
      state.category = payload;
    }),
  },
  mappings: {
    items: [],
    set: action((state, payload) => {
      state.items = payload;
    }),
    update: action((state, payload) => {
      const key = payload.key;
      const idx = payload.idx;
      const item = payload.item;

      console.log({ state: debug(state), payload });

      const mappings = state.items;

      const target = find(mappings, (mapping) => mapping.SWSIZE_ID === key);
      target.VALUES.splice(idx, 1, item);

      state.items = mappings;
    }),
    removeOne: action((state, payload) => {
      const key = payload.key;
      const idx = payload.idx;

      const mappings = state.items;

      console.log({ state: debug(state), payload });

      const target = find(mappings, (mapping) => mapping.SWSIZE_ID === key);
      target.VALUES.splice(idx, 1);

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

export const generateBoard = (targetCategory) => {
  const category = find(
    CLOTHES_CATEGORIES,
    (cat) => cat.key === targetCategory.key
  );

  const board = category.columns.map((col, idx) => {
    return {
      SWSIZE_ID: `${category.key}${idx + 1}`,
      SWSIZE_CONST: col,
      VALUES: [],
    };
  });

  return board;
};

export const Admin = (props) => {
  const loading = useStoreState((state) => state.app.loading)
  const setLoading = useStoreActions((actions) => actions.app.setLoading)
  const setSizes = useStoreActions((actions) => actions.sizes.set);
  const setMappings = useStoreActions((actions) => actions.mappings.set);

  const category = useStoreState((state) => state.location.category);

  const api = new fetchWP({
    restURL: props.wpObject.api_url,
    restNonce: props.wpObject.api_nonce,
  });

  useEffect(() => {
    async function fetchData() {
      const sizeQs = { taxonomies: category.taxonomies };

      const getSizes = api.get(`sizes?${querystring.encode(sizeQs)}`);

      const mappingQs = { category: category.key }

      const getMappings = api.get(`mapping?${querystring.encode(mappingQs)}`);
  
      Promise.all([getSizes, getMappings]).then(([{ sizes }, { mapping }]) => {
        setSizes(sizes);
  
        // Reconstruct mappings from database
        // provided to us from props.mappings
        // props.mappings is a flat array of mappings from the database [{}, {}, {}, ...]
  
        const board = generateBoard(category);
        console.log(board);
        // {
        //   SWSIZE_ID: 'MB01',
        //   SWSIZE_CONST: '27',
        //   VALUES: []
        // },
  
        each(mapping, (data) => {
          const target = find(
            board,
            (col) => col.SWSIZE_ID === data.size_category
          );
          target.VALUES.push({
            SWSIZE_ID: data.size_category,
            SWSIZE_CONST: data.size_category_size_ref,
            SWSIZE_TYPE: data.size_fit === '' ? ' ' : data.size_fit,
            SWSIZE_CAT: 'euro', // TODO: this needs to be saved, or inferred somehow, it doesn't even exist yet
            ID: data.id,
            VALUE: data.size,
          });
        });
  
        setMappings(board);
        setLoading(false);  
      })
    }
    fetchData()
  });

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
