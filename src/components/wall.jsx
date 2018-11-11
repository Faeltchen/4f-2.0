import React from 'react';
import BEMHelper from 'react-bem-helper';
import HTTPService from 'utils/HTTPService';
import ReactPaginate from 'react-paginate';
import Bricks from 'components/bricks';
import Brick from 'components/brick';

var classes = new BEMHelper("wall");
var defaultBrickSize = 180;

export default class Wall extends React.Component {
  constructor(props) {
    super(props);
    this.wallIndex = 0;
    this.loadContentFromServer();
  }

  state = {
    brickWidth: ((100 / Math.floor(document.body.clientWidth / defaultBrickSize)) / 100) *  document.body.clientWidth,
    perPage: 20,
    wallContent: [],
    data: [],
    offset: 0
  }

  render() {
    if(this.state.wallContent.length) {
      var self = this;

      var wallSizes = [
        { columns: 2, gutter: 0 },
        { mq: (defaultBrickSize * 3) + 'px', columns: 3, gutter: 0 },
        { mq: (defaultBrickSize * 4) + 'px', columns: 4, gutter: 0 },
        { mq: (defaultBrickSize * 5) + 'px', columns: 5, gutter: 0 },
        { mq: (defaultBrickSize * 6) + 'px', columns: 6, gutter: 0 },
        { mq: (defaultBrickSize * 7) + 'px', columns: 7, gutter: 0 },
        { mq: (defaultBrickSize * 8) + 'px', columns: 8, gutter: 0 },
        { mq: (defaultBrickSize * 9) + 'px', columns: 9, gutter: 0 },
        { mq: (defaultBrickSize * 10) + 'px', columns: 10, gutter: 0 },
      ]

      var largeImages = [0, 1, 2];
      var largeTightImages = [3, 4, 12, 28, 31, 33, 41, 42];
      var largeVeryTightImages = [5, 6, 13, 20, 21, 26, 39];
      var mediumImages = [11, 15, 16, 30, 37, 44];
      var mediumTightImages = [24, 27];
      var smallImages = [7, 8, 9, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 10, 14, 17, 18, 19, 22, 23, 25, 29, 32, 34, 35, 36, 38, 40, 43];

      var wallIndex = 0;
      var brickElements;

      [].concat(...[largeImages, largeTightImages, largeVeryTightImages, mediumImages, mediumTightImages, smallImages]).sort(function(a, b){return a - b}).forEach(function(brickNr) {
        if(wallIndex < self.state.wallContent.length) {
          if(largeImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 1)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'large').className} />
            )];
            wallIndex += 1;
          }
          else if(largeTightImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 1)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'large-tight').className} />
            )];
            wallIndex += 1;
          }
          else if(largeVeryTightImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 1)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'large-verytight').className} />
            )];
            wallIndex += 1;
          }
          else if(mediumImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 2)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'medium').className} />
            )];
            wallIndex += 2;
          }
          else if(mediumTightImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 2)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'medium-tight').className} />
            )];
            wallIndex += 2;
          }
          else if(smallImages.includes(brickNr)) {
            brickElements = [brickElements, (
              <Brick key={'brick-'+brickNr} subBricks={self.state.wallContent.slice(wallIndex, wallIndex + 3)}
              style={{width: self.state.brickWidth+"px"}} brick={brickNr} className={classes('brick', 'small').className} />
            )];
            wallIndex += 3;
          }
        }
      });

      return (
        <div {...classes()}>
          <MasonryLayout id="masonry-layout" sizes={wallSizes}>
            {brickElements}
          </MasonryLayout>
         <ReactPaginate
         previousLabel={"previous"}
         nextLabel={"next"}
         breakLabel={<a href="">...</a>}
         breakClassName={"break-me"}
         pageCount={this.state.pageCount}
         marginPagesDisplayed={2}
         pageRangeDisplayed={5}
         onPageChange={this.handlePageClick}
         containerClassName={"pagination"}
         subContainerClassName={"pages pagination"}
         activeClassName={"active"} />
       </div>
      );
    }
    else {
      return null;
    }
  }

  handlePageClick = (data) => {
    console.log(data);
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
      this.loadCommentsFromServer();
    });
  };

  loadContentFromServer() {
    HTTPService.post("/api/content/", {
      limit: this.props.perPage,
      offset: this.state.offset
    }, (status, response) => {
      this.setState({
        wallContent: response.wallContent,
        pageCount: Math.ceil(response.meta.total_count / response.meta.limit)});
    }, function(progressEvent) {

    });
  }

  updateDimensions() {
    this.setState({ brickWidth: ((100 / Math.floor(document.body.clientWidth / defaultBrickSize)) / 100) *  document.body.clientWidth});
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.forceUpdate();
  }
}

class MasonryLayout extends React.Component {

  static defaultProps = {
    style: {},
    className: '',
    packed: 'data-packed',
    sizes: [
      { columns: 2, gutter: 20 },
      { mq: '768px', columns: 3, gutter: 20 },
      { mq: '1024px', columns: 6, gutter: 20 }
    ]
  }

  componentDidMount() {
    const instance = Bricks({
      container: `#${this.props.id}`,
      packed: this.props.packed,
      sizes: this.props.sizes
    });

    instance.resize(true)

    if (this.props.children.length > 0) {
      instance.pack()
    }

    this.bricksInstance = instance;
  }

  componentDidUpdate(prevProps) {
    const instance = Bricks({
      container: `#${this.props.id}`,
      packed: this.props.packed,
      sizes: this.props.sizes
    });

    instance.resize(true)

    if (this.props.children.length > 0) {
      instance.pack()
    }

    this.bricksInstance = instance;

    if (prevProps.children.length === 0 && this.props.children.length === 0)
      return

    if (prevProps.children.length === 0 && this.props.children.length > 0) {
      return this.bricksInstance.pack()
    }

    if (prevProps.children.length !== this.props.children.length) {
      return this.bricksInstance.update()
    }
    this.bricksInstance.pack()
  }

  componentWillUnmount() {
    this.bricksInstance.resize(false)
  }

  render() {
    const { id, className, props, children } = this.props;
    return (
      <div
        id={id}
        className={className}
        style={props}
        >
        {children}
      </div>
    );
  }
}

/*
var largeImages = [0, 1, 2];
var largeTightImages = [3, 4];
var largeVeryTightImages = [5, 6];
var mediumImages = [];
var mediumTightImages = [];
var smallImages = [7, 8, 9, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const brickHeights = new Array();
 if(!largeImages.includes(i) && !largeTightImages.includes(i) &&
    !largeVeryTightImages.includes(i) && !mediumImages.includes(i) &&
    !smallImages.includes(i) && !mediumTightImages.includes(i)) {
   var random = Math.floor(Math.random() * 6) + 1;

   if(random == 1) {
     largeTightImages.push(i);
     //brickHeights[i] = Math.floor(Math.random() * 140) + 100;
     //brickHeights[i] = 100;
   }
   if(random == 6) {
     largeVeryTightImages.push(i);
     //brickHeights[i] = Math.floor(Math.random() * 140) + 100;
     //brickHeights[i] = 100;
   }
   else if(random == 2) {
     mediumImages.push(i);
     //brickHeights[i] = Math.floor(Math.random() * 100) + 50;
   }
   else if(random == 3) {
     mediumTightImages.push(i);
     //brickHeights[i] = Math.floor(Math.random() * 100) + 50;
   }
   else if(random == 4 || random == 5) {
     smallImages.push(i);
     //brickHeights[i] = Math.floor(Math.random() * 80) + 60;
   }
 }

 console.log(largeImages);
 console.log(largeTightImages)
 console.log(largeVeryTightImages);
 console.log(mediumImages);
 console.log(mediumTightImages);
 console.log(smallImages);
 console.log(brickHeights);
 */
