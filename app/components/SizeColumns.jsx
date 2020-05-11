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
    </div>
  );
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
