import Image from "next/image";
import styles from "../../public/styles/Blog.module.css";
import Header from "./components/header";
import Footer from "./components/footer";

interface BlogPost {
    id: number;
    title: string;
    description: string;
    image: string;
    slug: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "The Best Dresses for Spring 2025",
        description:
            "Find out the top trends and must-have dresses for this spring season. From floral prints to pastel colors, these dresses will make you stand out.",
        image: "green",
        slug: "best-dresses-spring",
    },
    {
        id: 2,
        title: "How to Choose the Perfect Evening Dress",
        description:
            "Get tips on selecting the perfect evening dress that matches your style, whether it's for a wedding, gala, or dinner party.",
        image: "meroon",
        slug: "perfect-evening-dress",
    },
    {
        id: 3,
        title: "Affordable Dresses Without Sacrificing Style",
        description:
            "Looking for trendy and affordable dresses? Here are some amazing options for stylish dresses that won’t break your budget.",
        image: "red",
        slug: "affordable-dresses",
    },
];

const Blog = () => {
    return (
        <>
            <Header />
            <div className={styles.container}>

                {/* <h1 className={styles.heading}>Our Latest Blog Posts</h1> */}

                <div className={styles.blogList}>
                    {blogPosts.map((post) => (
                        <div key={post.id} className={styles.blogPost}>
                            <Image
                                src={`/images/${post.image}.jpg`}
                                alt={post.title}
                                width={400}
                                height={300}
                                className={`${styles.image} md:tw-h-[70%]`}
                            />
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                            {/* <Link href={`/blog/${post.slug}`}>
      <span className={styles.readMore}>Read More</span>
    </Link> */}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;
