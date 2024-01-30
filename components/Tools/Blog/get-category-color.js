const categoryColorMap = new Map();

categoryColorMap.set("LifeStyle", "orange");
categoryColorMap.set("Music", "purple");
categoryColorMap.set("Art", "red");
categoryColorMap.set("Digital", "green");

const GetCategoryColor = (category) => {
  return categoryColorMap.get(category);
};

export default GetCategoryColor;
