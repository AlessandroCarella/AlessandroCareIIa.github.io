import TextPressure from "../components/TextPressure"

const Home = () => {
    return (
        <div>
            <TextPressure
                text="Hello, welcome"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#000000"
                strokeColor="#ff0000"
                minFontSize={72}
            />{" "}
            <TextPressure
                text="to my portfolio!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#000000"
                strokeColor="#ff0000"
                minFontSize={72}
            />{" "}
        </div>
    );
};

export default Home;
