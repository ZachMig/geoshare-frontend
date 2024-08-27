const About = () => {
  return (
    <div className="row mt-5 mx-4" style={{ fontSize: "18px" }}>
      {/* About GeoShare and Me */}
      <div className="col-6">
        <h4 className="mt-5">What is GeoSave?</h4>
        <p>
          GeoSave is a project designed for players of the popular browser game
          GeoGuessr. It allows users to save interesting Google Maps Street View
          locations and organize them into lists for later review.
        </p>
        <h4 className="mt-5">
          Where Can I <s>Complain</s> Send Constructive Feedback or Report A
          Bug?
        </h4>
        <p>
          If you have any features you would like to see added to GeoSave, or
          any bugs to report, please contact me at{" "}
          <a href="mailto:zmigliorini@gmail.com"> zmigliorini@gmail.com</a>.
        </p>
        <h4 className="mt-5">Show Me the Code!</h4>
        <p>
          GeoSave is built with Java/Spring for the back-end and
          React/Typescript for the front-end. Code is available at my{" "}
          <a href="https://www.github.com/zachmig"> GitHub</a>.
        </p>
        <h4 className="mt-5">
          Who Made This? I Want to Hire Them Immediately!
        </h4>
        <p>
          GeoSave is a project by me, Zach Migliorini. I am an aspiring software
          developer looking for work in the NYC area. More info at{" "}
          <a href="https://www.zachmig.com">ZachMig.com</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
