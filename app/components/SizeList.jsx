import React from 'react';

import Badge from 'react-bootstrap/Badge';
import { Draggable } from 'react-beautiful-dnd';
import { chunk, reduce } from 'lodash';

export const SizeItem = (props) => {
  const id = `${props.size.VALUE}${props.size.SWSIZE_TYPE}`;
  return (
    <Draggable draggableId={id} index={props.idx}>
      {(provided, snapshot) => (
        <React.Fragment>
          <div
            className='jd-size-item'
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {props.size.VALUE}
            <Badge>{props.size.SWSIZE_TYPE}</Badge>
          </div>
          {snapshot.isDragging && (
            <div className='jd-size-item'>
              {props.size.VALUE}
              <Badge>{props.size.SWSIZE_TYPE}</Badge>
            </div>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
};

export const SizeList = React.memo(function SizeList(props) {
  const rows = chunk(props.sizes, 1);
  const items = reduce(
    rows,
    (acc, row, rowIdx) => {
      const cat = row[0].SWSIZE_CAT.toUpperCase() || 'ERROR';
      acc.push(
        <Badge id='jd-swsize_type-badge' variant='dark'>
          {cat}
        </Badge>
      );

      const additionalIdx = rowIdx * row.length;

      const sizeItems = row.map((size, idx) => (
        <SizeItem
          size={size}
          key={idx + additionalIdx}
          idx={idx + additionalIdx}
        />
      ));

      acc.push(sizeItems);

      return acc;
    },
    []
  );

  return <div className='jd-size-list'>{items}</div>;
});
