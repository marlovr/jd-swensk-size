import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Badge from 'react-bootstrap/Badge';
import { find } from 'lodash';
import { useStoreState, useStoreActions } from 'easy-peasy';

export const SizeItem = ({ value, itemIdx, SWSIZE_ID }) => {
  const item = `${value.VALUE}${value.SWSIZE_TYPE}`;
  const [sizeValues, setSizeValues] = useState([
    {
      id: '++',
      selected: value.SWSIZE_TYPE === '++',
    },
    {
      id: '+',
      selected: value.SWSIZE_TYPE === '+',
    },
    {
      id: '-',
      selected: value.SWSIZE_TYPE === '-',
    },
    {
      id: '--',
      selected: value.SWSIZE_TYPE === '--',
    },
  ]);

  const updateItem = useStoreActions((actions) => actions.mappings.update);

  /**
   * Update an item in place
   */
  const updateMe = (SWSIZE_TYPE) => {
    const currentlySelected = find(sizeValues, (value) => value.selected);
    // If we are de-selecting
    if (currentlySelected && currentlySelected.id === SWSIZE_TYPE) {
      const newValue = value;
      newValue.SWSIZE_TYPE = ' ';
      updateItem({
        key: SWSIZE_ID,
        idx: itemIdx,
        item: newValue,
      });
      const newState = sizeValues.map((value) => {
        return {
          id: value.id,
          selected: false,
        };
      });
      setSizeValues(newState);
    } else {
      // if we are selecting
      const newValue = value;
      newValue.SWSIZE_TYPE = SWSIZE_TYPE;
      updateItem({
        key: SWSIZE_ID,
        idx: itemIdx,
        item: newValue,
      });
      const newState = sizeValues.map((value) => {
        return {
          id: value.id,
          selected: SWSIZE_TYPE === value.id,
        };
      });

      setSizeValues(newState);
    }
  };

  const sizeButtons = sizeValues.map((size_value) => {
    const isSelected = size_value.selected;
    const variant = isSelected ? 'danger' : 'dark';
    const buttonClick = () => {
      updateMe(size_value.id);
    };
    return (
      <Badge key='' variant={variant} onClick={buttonClick}>
        {size_value.id}
      </Badge>
    );
  });

  return (
    <div className='jd-size-item' key={item}>
      {value.VALUE}
      {sizeButtons}
      <RemoveButton idx={itemIdx} itemKey={SWSIZE_ID} />
    </div>
  );
};

const TrashIcon = () => {
  return (
    <svg
      className='bi bi-trash'
      width='1em'
      height='1em'
      viewBox='0 0 16 16'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
      <path
        fillRule='evenodd'
        d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
      />
    </svg>
  );
};

const RemoveButton = ({ idx, itemKey }) => {
  const removeItem = useStoreActions((actions) => actions.mappings.removeOne);
  const style = {
    backgroundColor: '#333',
    display: 'inline-block',
    padding: '3px',
    color: 'white',
    fontSize: '12px',
    marginLeft: '5px'
  }

  const onClick = (e) => {
    e.preventDefault();
    removeItem({
      idx,
      key: itemKey,
    });
  };

  return <div style={style} onClick={onClick}><TrashIcon /></div>;
};

export const SizeColumn = (props) => {
  const sizeItems = props.sw_size.VALUES.map((value, itemIdx) => (
    <SizeItem
      key=''
      value={value}
      itemIdx={itemIdx}
      SWSIZE_ID={props.sw_size.SWSIZE_ID}
    />
  ));

  return (
    <div>
      <div className='jd-swsize-id-title'>{props.sw_size.SWSIZE_ID}</div>
      <div>{sizeItems}</div>
    </div>
  );
};

export const SizeColumnCollection = function SizeColumnCollection() {
  const mappings = useStoreState((state) => state.mappings.items);
  const COLUMN_SIZE = 225;

  const columns = mappings.map((sw_size) => {
    return (
      <Droppable key={sw_size.SWSIZE_ID} droppableId={sw_size.SWSIZE_ID}>
        {(provided) => (
          <div
            className='jd-size-column'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <SizeColumn sw_size={sw_size} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  });

  const style = {
    width: `${columns.length * COLUMN_SIZE}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${mappings.length}, 1fr)`,
  };

  return (
    <div className='jd-size-column-collection' style={style}>
      {columns}
    </div>
  );
};
