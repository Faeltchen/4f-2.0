import React from 'react';
import PropTypes from 'prop-types';
import Bricks from 'components/bricks';
import BEMHelper from 'react-bem-helper';
import HTTPService from 'utils/HTTPService';
var classes = new BEMHelper("wall");
var defaultBrickSize = 180;

export default class Wall extends React.Component {
  constructor(props) {
    super(props);
    this.sendRequest();
  }

  state = {
    brickWidth: ((100 / Math.floor(document.body.clientWidth / defaultBrickSize)) / 100) *  document.body.clientWidth,
    perPage: 60,
    items: Array(60).fill()
   }

   loadItems = () => {
     this.setState({
       items: this.state.items.concat(Array(this.state.perPage).fill())
     });
   }

   render() {
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
    /*
    var largeImages = [0, 1, 2];
    var largeTightImages = [3, 4];
    var largeVeryTightImages = [5, 6];
    var mediumImages = [];
    var mediumTightImages = [];
    var smallImages = [7, 8, 9, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const brickHeights = new Array();
    */

    var largeImages = [0, 1, 2];
    var largeTightImages = [3, 4, 12, 28, 31, 33, 41, 42];
    var largeVeryTightImages = [5, 6, 13, 20, 21, 26, 39];
    var mediumImages = [11, 15, 16, 30, 37, 44];
    var mediumTightImages = [24, 27];
    var smallImages = [7, 8, 9, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 10, 14, 17, 18, 19, 22, 23, 25, 29, 32, 34, 35, 36, 38, 40, 43];

    return (
     <div {...classes()}>

       <MasonryLayout
         id="masonry-layout"
         sizes={wallSizes}
         >

         {this.state.items.map((v, i) => {
           /*
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

           if(largeImages.includes(i) || largeTightImages.includes(i) || largeVeryTightImages.includes(i)) {
             var classname = 'large';
             if(largeTightImages.includes(i))
               classname = 'large-tight';
             else if(largeVeryTightImages.includes(i))
               classname = 'large-verytight';
             return (
              <div style={{width: this.state.brickWidth+"px"}} key={i} {...classes('brick', classname)} data-brick={i}>
                <div key={'brick-'+i+'-1'}>
                  {i}
                </div>
              </div>
             );
           }
           else if(mediumImages.includes(i)) {
             var classname = 'medium';
             if(mediumTightImages.includes(i))
               classname = 'medium-tight';
             return (
              <div style={{width: this.state.brickWidth+"px"}} key={i} {...classes('brick', classname)} data-brick={i}>
                <div key={'brick-'+i+'-1'}>
                </div>
                <div key={'brick-'+i+'-2'}>
                </div>
              </div>
             );
           }
           else if(smallImages.includes(i)) {
             return (
              <div style={{width: this.state.brickWidth+"px"}} key={i} {...classes('brick', 'small')} data-brick={i}>
                <div key={'brick-'+i+'-1'}>
                </div>
                <div key={'brick-'+i+'-2'}>
                </div>
                <div key={'brick-'+i+'-3'}>
                </div>
              </div>
             );
           }}
         )}

       </MasonryLayout>
     </div>
    );
  }

  sendRequest() {
    console.log(this.props);
    HTTPService.post("/api/content/", {

    }, (status, response) => {
      console.log(response);
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
  static propTypes = {
    id: PropTypes.string.isRequired,
    packed: PropTypes.string,
    sizes: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  }

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
