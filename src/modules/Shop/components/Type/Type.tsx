import { db } from "@/firebase";
import { Tabs } from "antd";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import "./Type.css";
import TypeList from "./TypeList";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams

interface Category {
  [key: string]: {
    category_name: string;
  };
}

interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
}

function Type() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams(); // Use searchParams for handling URL search parameters
  const [activeKey, setActiveKey] = useState("0");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbRef = ref(db, "categories");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setCategories(Object.values(snapshot.val()));
        } else throw new Error("No categories found!");
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const handleItemClicked = (key: string) => {
    setActiveKey(key);
    // Adjusted to only pass key
    // console.log("clicked", categories[key]);
    // Update search params when an item is clicked
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("type", categories[key].category_name);
    // console.log("new ser", newSearchParams);
    setSearchParams(newSearchParams);
  };

  const items: TabItem[] = Object.keys(categories).map(
    (key: string, index: number) => {
      return {
        key: `${index}`,
        label: categories[key].category_name,
        children: <TypeList />,
      };
    }
  );
  
  return (
    <div className="container mx-auto">
      <Tabs onTabClick={handleItemClicked} activeKey={activeKey} items={items} />
    </div>
  );
}

export default Type;
