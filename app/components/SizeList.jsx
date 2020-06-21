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
          </div>
          {snapshot.isDragging && (
            <div className='jd-size-item'>
              {props.size.VALUE}
            </div>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
};


const TagIcon = () => {
  return (
    <svg className="bi bi-tag" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M.5 2A1.5 1.5 0 0 1 2 .5h4.586a1.5 1.5 0 0 1 1.06.44l7 7a1.5 1.5 0 0 1 0 2.12l-4.585 4.586a1.5 1.5 0 0 1-2.122 0l-7-7A1.5 1.5 0 0 1 .5 6.586V2zM2 1.5a.5.5 0 0 0-.5.5v4.586a.5.5 0 0 0 .146.353l7 7a.5.5 0 0 0 .708 0l4.585-4.585a.5.5 0 0 0 0-.708l-7-7a.5.5 0 0 0-.353-.146H2z"/>
  <path fillRule="evenodd" d="M2.5 4.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm2-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
</svg>
  )
}


export const SizeList = React.memo(function SizeList(props) {
  const rows = chunk(props.sizes, 1);
  const items = reduce(
    rows,
    (acc, row, rowIdx) => {
      const cat = row[0].SWSIZE_CAT.toUpperCase() || 'ERROR';
      acc.push(
        <Badge id='jd-swsize_type-badge' variant='dark'>
          <TagIcon/>
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
