import { useState, useEffect } from "react";
import { Input, Label } from "reactstrap";

const UpdateHierarchicalCheckbox = ({
  data,
  setSelectedParent,
  parentCategories = [],
}) => {
  const [checked, setChecked] = useState({});

  // Initialize checked state based on parent categories
  useEffect(() => {
    if (parentCategories.length > 0) {
      const preChecked = {};
      parentCategories.forEach((parent) => {
        preChecked[parent._id] = true;
      });
      setChecked(preChecked);
    }
  }, [parentCategories]);

  // Toggle check status and update state
  const handleCheck = (item) => {
    const newCheckedState = { ...checked };

    // Check the current item and uncheck all siblings at the same level
    const isCurrentlyChecked = newCheckedState[item._id];
    newCheckedState[item._id] = !isCurrentlyChecked;

    // Uncheck siblings at the same level
    if (!isCurrentlyChecked) {
      uncheckSiblings(item, newCheckedState);
      checkParent(item, newCheckedState); // Ensure parents are checked
    } else {
      uncheckChildren(item, newCheckedState); // Uncheck children if unchecked
    }
    let lastCheckedCategoryId = getLastCheckedParent(newCheckedState);
    console.log(lastCheckedCategoryId);
    // Update the selected parent
    let lastCat = findCategoryById(data, lastCheckedCategoryId);
    setSelectedParent(lastCat);

    setChecked(newCheckedState);
  };

  // Function to get the last checked parent category (to be the parent of the current category)
  const getLastCheckedParent = (newCheckedState) => {
    let lastCheckedParent = null;
    Object.keys(newCheckedState).forEach((key) => {
      if (newCheckedState[key]) {
        lastCheckedParent = key;
      }
    });
    return lastCheckedParent;
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

  // Uncheck siblings of a given item (at the same depth level)
  const uncheckSiblings = (item, newCheckedState) => {
    const parentCategory = findCategoryById(data, item.parentCatId);
    const siblings = parentCategory ? parentCategory.subCategories : data;
    siblings.forEach((sibling) => {
      if (sibling._id !== item._id) {
        newCheckedState[sibling._id] = false;
        uncheckChildren(sibling, newCheckedState); // Uncheck sibling's children as well
      }
    });
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

  // Render checkboxes recursively, excluding the current category
  const renderItems = (items, depth = 0) => {
    return items.map((item) => (
      <div key={item._id} style={{ marginLeft: 25 }}>
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

export default UpdateHierarchicalCheckbox;
