import TextPressure from "../components/TextPressure";
import ProjectCard from "../components/ProjectCard";
import SkillsDemo from "../components/demo/SkillsDemo";

const Home = () => {
    const projects = [
        {
            title: "E-Commerce Analytics Platform",
            description:
                "Built a comprehensive analytics dashboard for e-commerce businesses using React and D3.js. Implemented real-time data visualization, customer segmentation, and predictive modeling using Python and scikit-learn. The platform processes over 1M transactions daily and provides actionable insights for business growth.",
            backgroundImage:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            pdfLink: "https://example.com/project-report.pdf",
            githubLink: "https://github.com/yourusername/ecommerce-analytics",
            presentationLink: "https://example.com/presentation.pdf",
        },
        {
            title: "Machine Learning Pipeline",
            description:
                "Developed an end-to-end ML pipeline for fraud detection in financial transactions. Utilized Python, TensorFlow, and Apache Kafka for real-time processing. Achieved 95% accuracy with minimal false positives.",
            backgroundImage:
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
            githubLink: "https://github.com/yourusername/fraud-detection",
            presentationLink: "https://example.com/ml-slides.pdf",
        },
        {
            title: "Social Network Analysis Tool",
            description:
                "Created a graph-based analysis tool to identify influential nodes and community structures in social networks. Built with Neo4j, NetworkX, and React for visualization.",
            backgroundImage:
                "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
            pdfLink: "https://example.com/research-paper.pdf",
            githubLink: "https://github.com/yourusername/network-analysis",
        },
    ];

    return (
        <div>
            <TextPressure
                text="Welcome to my portfolio!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={72}
            />{" "}
            {/* <TextPressure
                text="my portfolio!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={72}
            />{" "} */}
            {/* <section className="projects-grid">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        title={project.title}
                        description={project.description}
                        backgroundImage={project.backgroundImage}
                        pdfLink={project.pdfLink}
                        githubLink={project.githubLink}
                        presentationLink={project.presentationLink}
                        colors={project.colors}
                    />
                ))}
            </section> */}
            {/* <SkillsDemo></SkillsDemo> */}
        </div>
    );
};

export default Home;
