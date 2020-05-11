import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SizeColumnCollection } from './SizeColumns';
import { SizeList } from './SizeList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { dropSizeInBucket } from '../utils/reorder';
import { MenuBar } from './MenuBar';
import { getSortedSizes } from '../utils/sizes';
import Button from 'react-bootstrap/Button';
import { cloneDeep } from 'lodash';

import { useStoreState, useStoreActions } from 'easy-peasy';

import { Scrollbars } from 'react-custom-scrollbars';

export const CLOTHES_CATEGORIES = [
  {
    name: 'Bottoms',
  },
  {
    name: 'Tops',
  },
];

export const SizeMap = (props) => {
  const mappings = useStoreState((state) => state.mappings.items);
  const setMappings = useStoreActions((actions) => actions.mappings.set);

  const sizes = useStoreState((state) => getSortedSizes(state.sizes.items));

  const [showLeftArea, setShowLeftArea] = useState(true);

  const HideThinger = () => {
    const onClick = () => {
      setShowLeftArea(!showLeftArea);
    };
    const txt = showLeftArea ? 'Hide Size Chart' : 'Show Size Chart';

    return <Button onClick={onClick}>{txt}</Button>;
  };

  function onDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'tasks') {
        // setTasks(reorder(tasks, source.index, destination.index));
      }
      // In our current UI it won't be possible to reorder trash
      return;
    }

    const dropResult = dropSizeInBucket({
      mapping: mappings,
      destination,
      value: sizes[source.index],
    });

    setMappings(dropResult);
  }

  const gridStyle = showLeftArea
    ? {
        gridTemplateColumns: '0.4fr 1fr',
      }
    : {
        gridTemplateColumns: '0fr 1fr',
      };

  const leftHeight = `${sizes.length * 46}px`;

  const tallestColumn = cloneDeep(mappings)
    .sort((a, b) => a.VALUES.length - b.VALUES.length)
    .pop();
  const colHeight = tallestColumn.VALUES.length * 36 + 100;
  const rightHeight = colHeight <= 170 ? 170 : colHeight; // all the items in the columns, + the header

  const leftStyle = showLeftArea
    ? {
        opacity: 1,
        height: leftHeight,
      }
    : {
        opacity: 0,
      };

  const rightStyle = {
    height: `${rightHeight}px`,
  };

  const menuBarProps = { ...props, clothesCategories: CLOTHES_CATEGORIES };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MenuBar {...menuBarProps}>
        <HideThinger />
      </MenuBar>
      <div className='swensk-size-container' style={gridStyle}>
        <div className='jd-left' style={leftStyle}>
          <Scrollbars>
            <Droppable droppableId='size-items' isDropDisabled={true}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <SizeList sizes={sizes} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Scrollbars>
        </div>
        <div className='jd-right' style={rightStyle}>
          <Scrollbars autoHide={true}>
            <SizeColumnCollection />
          </Scrollbars>
        </div>
      </div>
    </DragDropContext>
  );
};

SizeMap.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string),
};
