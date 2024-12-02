import { useState, useEffect, useCallback } from "react";
import { Input, Label } from "reactstrap";

const HierarchicalCheckbox = ({ data, setSelectedParent, parentCategories = [] }) => {
  const [checked, setChecked] = useState({});

  // Toggle check status and update state
  const handleCheck = (item) => {
    const newCheckedState = { ...checked };
    const isCurrentlyChecked = newCheckedState[item._id];

    // Toggle the checked state
    newCheckedState[item._id] = !isCurrentlyChecked;

    // If the item is being checked, ensure its parent is also checked
    if (newCheckedState[item._id]) {
      checkParent(item, newCheckedState);
    } else {
      uncheckChildren(item, newCheckedState);
    }

    // Update selected parent based on the current state
    setSelectedParent(newCheckedState[item._id] ? item : null);

    setChecked(newCheckedState);
  };

  // Ensure parent categories are checked when a child is checked
  const checkParent = (item, newCheckedState) => {
    if (item.parentCatId) {
      const parentCategory = findCategoryById(data, item.parentCatId);
      if (parentCategory) {
        newCheckedState[parentCategory._id] = true;
        checkParent(parentCategory, newCheckedState); // Recursively check parents
      }
    }
  };

  // Uncheck all children of a given item
  const uncheckChildren = (item, newCheckedState) => {
    if (item.subCategories.length > 0) {
      item.subCategories.forEach((child) => {
        newCheckedState[child._id] = false;
        uncheckChildren(child, newCheckedState); // Recursively uncheck children
      });
    }
  };

  // Find a category by its ID in the data
  const findCategoryById = (items, id) => {
    for (const item of items) {
      if (item._id === id) return item;
      if (item.subCategories.length > 0) {
        const found = findCategoryById(item.subCategories, id);
        if (found) return found;
      }
    }
    return null;
  };

  const checkChildren = useCallback((item, newCheckedState) => {
    if (item.subCategories.length > 0) {
      item.subCategories.forEach((child) => {
        newCheckedState[child._id] = true;
        checkChildren(child, newCheckedState); // Recursively check children
      });
    }
  }, []);

  // // Preselect checkboxes based on parentCategories (only for update scenario)
  // useEffect(() => {
  //   if (parentCategories && parentCategories.length > 0) {
  //     const newCheckedState = {};

  //     parentCategories.forEach((parent) => {
  //       newCheckedState[parent._id] = true;
  //       if (
  //         parent.subCategories !== null &&
  //         parent.subCategories !== undefined &&
  //         parent.subCategories.length !== 0
  //       ) {
  //         checkChildren(parent, newCheckedState); // Optionally check children as well
  //       }
  //     });

  //     setChecked(newCheckedState);
  //   }
  // }, [parentCategories, checkChildren]);

  // Render checkboxes recursively
  const renderItems = (items, depth = 0) => {
    return items.map((item) => (
      <div key={item._id} style={{ marginLeft: depth * 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="form-check mb-2">
            <Label
              className="form-check-label"
              htmlFor={`checkbox_${item._id}`}
            >
              {item.categoryName}
            </Label>
            <Input
              type="checkbox"
              className="form-check-input input-mini"
              id={`checkbox_${item._id}`}
              checked={checked[item._id] || false}
              onChange={() => handleCheck(item)}
            />
          </div>
        </div>
        {checked[item._id] &&
          item.subCategories.length > 0 &&
          renderItems(item.subCategories, depth + 1)}
      </div>
    ));
  };

  return <div>{renderItems(data)}</div>;
};

export default HierarchicalCheckbox;
