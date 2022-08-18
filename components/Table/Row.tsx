import React from "react";
import { useDrag, useDrop } from "react-dnd";

const Row = ({ row, index, moveRow }: any) => {
    const DND_ITEM_TYPE = "row";
    const dropRef: any = React.useRef(null);
    const dragRef = React.useRef(null);
  
    const [, drop] = useDrop({
      accept: DND_ITEM_TYPE,
      hover(item: any, monitor: any) {
        if (!dropRef.current) {
          return;
        }
        const dragIndex: any = item.index;
        const hoverIndex = index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = dropRef.current.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        // Time to actually perform the action
        moveRow(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });
  
    const [{ isDragging }, drag, preview] = useDrag({
      type: DND_ITEM_TYPE,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    const opacity = isDragging ? 0 : 1;
  
    preview(drop(dropRef));
    drag(dragRef);
  
    return (
      <tr
        ref={dropRef}
        style={{ opacity }}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      >
        {row.cells.map((cell: any) => {
          return (
            <td
              ref={cell.column.id === "name" ? dragRef : null}
              {...cell.getCellProps()}
              className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-[12px] font-bold cursor-grab`}
            >
              {cell.render("Cell")}
            </td>
          );
        })}
      </tr>
    );
  };
  

  export default Row;