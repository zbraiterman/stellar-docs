import fs from "fs";
import path from "path";

module.exports = async ({ defaultSidebarItemsGenerator, ...args }) => {
  const docs = args.docs.filter(
    (item) =>
      !item.source.includes(".api.mdx") &&
      !item.source.includes(".tag.mdx") &&
      item.source !== "@site/api/READ_FIRST.md",
  );

  // Get the sidebar items that are generated by default
  const sidebarItems = await defaultSidebarItemsGenerator({ ...args, docs });

  // Find the "Interactive Learning" category
  const interactiveLearning = sidebarItems.find(
    (item) =>
      item.type === 'category' && item.label.toLowerCase() === 'interactive learning',
  );

  // Find the "Dapps Challenge" category within "Interactive Learning"
  const dappsChallenge = interactiveLearning?.items.find(
    (item) =>
      item.type === 'category' && item.label.toLowerCase() === 'dapps challenge',
  );

  // If the Dapps Challenge has been found, insert a link to the Dashboard in
  // the sidebar.
  if (dappsChallenge) {
    dappsChallenge.items.splice(1, 0, {
      type: 'link',
      href: '/docs/learn/interactive/dapps/dashboard',
      label: 'Dapps Challenge Dashboard',
    });
  }

  const horizonCategory = sidebarItems.find(
    (item) => item.type === "category" && item.label.toLowerCase() === "horizon",
  );
  
  if (horizonCategory) {
    const apiReference = horizonCategory.items.find(
      (item) => item.type === "category" && item.label.toLowerCase() === "api reference",
    );

    if (apiReference) {
      const resources = apiReference.items.find(
        (item) =>
          item.type === "category" && item.label.toLowerCase() === "resources",
      );
      const aggregations = apiReference.items.find(
        (item) =>
          item.type === "category" && item.label.toLowerCase() === "aggregations"
      )

      const sidebarPath = path.join(
        args.version.contentPath,
        args.item.dirName,
        "./horizon/api-reference/sidebar.ts",
      );

      if (resources && fs.existsSync(sidebarPath)) {
        const generatedApiSidebar = require(sidebarPath)[0];

        const categories = resources.items.filter(
          (item) => item.type === "category",
        );

        categories.forEach((category) => {
          const generatedCategory = generatedApiSidebar.items.find(
            (item) => item.type === "category" && item.label === category.label,
          );

          if (generatedCategory) {
            category.items = [...category.items, ...generatedCategory.items];
          }
        });
      }

      if (aggregations && fs.existsSync(sidebarPath)) {
        const generatedApiSidebar = require(sidebarPath)[1];

        const categories = aggregations.items.filter(
          (item) => item.type === "category",
        );

        categories.forEach((category) => {
          const generatedCategory = generatedApiSidebar.items.find(
            (item) => item.type === "category" && item.label === category.label,
          );

          if (generatedCategory) {
            category.items = [...category.items, ...generatedCategory.items];
          }
        });
      }

    }
  }

  // return the sidebar items
  return sidebarItems;
};
