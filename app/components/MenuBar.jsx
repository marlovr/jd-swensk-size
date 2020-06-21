import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import { each } from 'lodash';
import { useStoreActions, useStoreState } from 'easy-peasy';

export const saveData = ({ fetchWP, mappings, setShow }) => {
  // mappings = data in the interface
  // setMappings = update data in the interface setState()

  // save data to wordpress database
  return new Promise((resolve, reject) => {
    const toSave = mappings.reduce((acc, data) => {
      const rows = data.VALUES.map((size) => {
        return {
          size: size.VALUE,
          size_fit: size.SWSIZE_TYPE,
          size_category: data.SWSIZE_ID,
          size_category_size_ref: data.SWSIZE_CONST,
          size_umbrella: data.SWSIZE_UMBRELLA
        };
      });

      acc = [...acc, ...rows];
      return acc;
    }, []);

    fetchWP
      .post('mapping', toSave)
      .then((result) => {
        setShow(true);
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const resetData = ({ mappings, setMappings }) => {
  // mappings = data in the interface
  // setMappings = update data in the interface setState()

  each(mappings, (mapping) => {
    mapping.VALUES = [];
  });

  // reset data in state, do not save to wordpress database
  setMappings(mappings);
};

export const ClothesCats = (props) => {
  const currentCategory = useStoreState((state) => state.location.category)
  const updateCategory = useStoreActions((actions) => actions.location.set)
  const setLoading = useStoreActions((actions) => actions.app.setLoading)

  const onClick = (e, cat) => {
    e.preventDefault()
    setLoading(true)
    updateCategory(cat)
  }
  
  const cats = props.clothesCategories.map((cat, idx) => (
    <Dropdown.Item key={idx} href='#/action-1' onClick={(e) => onClick(e, cat)}>
      {cat.name}
    </Dropdown.Item>
  ));

  return (
    <DropdownButton id='clothes-categories' title={currentCategory.name}>
      {cats}
    </DropdownButton>
  );
};

export const SaveButton = (props) => {
  const [isSaving, setIsSaving] = useState(false);
  const mappings = useStoreState((state) => state.mappings.items);
  const setShow = useStoreActions((actions) => actions.toast.set);
  const save = () => {
    setIsSaving(true);
    saveData({ fetchWP: props.fetchWP, mappings, setShow }).then(() => {
      setIsSaving(false);
    });
  };
  const output = isSaving ? (
    <Button>
      <Spinner size='sm' animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </Button>
  ) : (
    <Button onClick={save}>Save</Button>
  );
  return <>{output}</>;
};

export const Actions = (props) => {
  const setMappings = useStoreActions((actions) => actions.mappings.set);
  const mappings = useStoreState((state) => state.mappings.items);
  const reset = () => resetData({ mappings, setMappings });

  return (
    <div className='jd-save-reset'>
      <SaveButton {...props} />
      <Button onClick={reset}>Reset</Button>
    </div>
  );
};

export const MenuBar = (props) => {
  const setShow = useStoreActions((actions) => actions.toast.set);
  const show = useStoreState((state) => state.toast.show);
  return (
    <React.Fragment>
      <div className='menubar-container'>
        <div>
          <ClothesCats {...props} />
          {props.children}
        </div>
        <Actions {...props} />
      </div>

      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className='mr-auto'>SUCCESS</strong>
        </Toast.Header>
        <Toast.Body>Woohoo, mapping has been saved!</Toast.Body>
      </Toast>
    </React.Fragment>
  );
};
