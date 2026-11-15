import Link from "next/link";
import { Category } from "@/lib/mockData";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/productos?category=${category.slug}`} className={styles.card}>
      <div className={styles.iconWrapper}>
        <span>{category.icon || "⚙️"}</span>
      </div>
      <h3 className={styles.name}>{category.name}</h3>
      <span className={styles.count}>{category.count || 0} productos</span>
    </Link>
  );
}

