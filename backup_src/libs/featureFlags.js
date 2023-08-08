/* eslint-disable max-classes-per-file */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-else-return */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  SplitFactory,
  SplitClient,
  SplitTreatments,
} from "@splitsoftware/splitio-react";

/* 
  Example use case:
    // 1. Invoked once on either an auth'd or unauth'd route
    import { initializeSplit } from "./libs/featureFlags";
    // Optional props accpeted; 
      splitKey, 
      uniqueId,
      options,
      updateOnSdkUpdate,
      updateOnSdkTimedout,
    // for details on options refer to the split.io documentation on configuration
    // https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#configuration
    <FeatureFactory>
        //child classes go here...
    </FeatureFactory>
    // 2. Imported only when customerId changes
    import { updateSplit } from "./libs/featureFlags";
    // Mandatory props accpeted; splitKey
    // Optional props accpeted; updateOnSdkUpdate, updateOnSdkTimedout
    <FeatureClient>
        //child classes go here...
    </FeatureClient>
    // 3. After intializing with these HOCs, <FeatureTreatment /> is wrapped around 
    // components that require a split treatment
      import { FeatureTreatment } from "./libs/featureFlags";
      <FeatureTreatment
        treatmentName={splits.SHOW_CHAT}
        attributes={attr}
        onLoad={() => {
          // update component state here for loading indicators
          console.log("Split is loading...");
        }}
        onTimedout={() => {
          console.log("Split has timed out.");
        }}
      >
      {children}
      <FeatureTreatment/>
*/

const splitConfig = (uniqueId, splitKey, options) => ({
  core: {
    authorizationKey: splitKey,
    key: uniqueId,
  },
  ...options,
});

// Used once at the parent most component to avail split treatment functionality
// When the application first loads
export class FeatureFactory extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      splitKey,
      uniqueId = "Anonymous",
      updateOnSdkUpdate = true,
      updateOnSdkTimedout = true,
      options = {},
      children,
    } = this.props;
    return (
      <SplitFactory
        config={splitConfig(uniqueId, splitKey, options)}
        updateOnSdkUpdate={updateOnSdkUpdate}
        updateOnSdkTimedout={updateOnSdkTimedout}
      >
        {children}
      </SplitFactory>
    );
  }
}

// Used when the factory is already initialized and the split key needs to be changed.
export class FeatureClient extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      splitKey,
      updateOnSdkUpdate = true,
      updateOnSdkTimedout = true,
      children,
    } = this.props;
    return (
      <SplitClient
        splitKey={splitKey}
        updateOnSdkUpdate={updateOnSdkUpdate}
        updateOnSdkTimedout={updateOnSdkTimedout}
      >
        {children}
      </SplitClient>
    );
  }
}

// Used to evaluate a split treatment
export class FeatureTreatment extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      treatmentName,
      attributes,
      invertBehavior,
      children,
      onLoad,
      onTimedout,
      showUnlessOff,
    } = this.props;
    return (
      <SplitTreatments names={[treatmentName]} attributes={attributes}>
        {({ treatments, isReady, isTimedout }) => {
          const { treatment, config } = treatments[treatmentName];
          if (!isReady) {
            return onLoad();
          } else if (isTimedout) {
            return onTimedout();
          }

          // Passing split config value as JSON
          const featureconfig = JSON.parse(config);

          // Cloning child to new react element with updated props since props are read-only
          let clonedChild;

          if (Array.isArray(children)) {
            clonedChild = children.map((item,index) => {
              const element =
                item !== undefined && item !== false
                  ? <React.Fragment key={`${item}_${index}`}> {React.cloneElement(item, {
                      featureconfig,
                    })}</React.Fragment>
                  : item;
              return element;
            });
          } else {
            clonedChild =
              children !== undefined && children !== false
                ? React.cloneElement(children, {
                    featureconfig,
                  })
                : children;
          }

          /*  console.log(
            `Treatment for ${treatmentName} is ${treatment} with config: `,
            JSON.parse(config)
          );
          console.log(`Cloned child for ${treatmentName}: `, clonedChild); */

          // if a split treatment is on, and the behavior isn't inverted
          if (treatment === "on" && !invertBehavior) {
            return clonedChild;
          }
          // if a split treatment is on, and the behavior is inverted
          else if (treatment === "on" && invertBehavior) {
            return <></>;
          }
          // if a split treatment is off, and the behavior is inverted
          else if (treatment === "off" && invertBehavior) {
            return clonedChild;
          }
          // if a split treatment is off, and the behavior isn't inverted
          else if (treatment === "off" && !invertBehavior) {
            return <></>;
          }
          // if a split treatment failes to load, and the behavior isn't inverted
          else if (treatment === "control" && !invertBehavior) {
            return <></>;
          }
          // if a split treatment failes to load, and the behavior is inverted
          // the children will load as if the feature is turned off
          else if (treatment === "control" && invertBehavior) {
            return clonedChild;
          }
          else if(showUnlessOff) {
            return clonedChild;
          }
          return <></>;
        }}
      </SplitTreatments>
    );
  }
}

FeatureFactory.defaultProps = {
  uniqueId: "Anonymous",
  updateOnSdkUpdate: true,
  updateOnSdkTimedout: true,
  options: {},
};

FeatureFactory.propTypes = {
  splitKey: PropTypes.string.isRequired,
  uniqueId: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.object.isRequired]),
  updateOnSdkUpdate: PropTypes.bool,
  updateOnSdkTimedout: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
  ]).isRequired,
};

FeatureClient.defaultProps = {
  splitKey: "Anonymous",
  updateOnSdkUpdate: true,
  updateOnSdkTimedout: true,
};

FeatureClient.propTypes = {
  splitKey: PropTypes.string,
  updateOnSdkUpdate: PropTypes.bool,
  updateOnSdkTimedout: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]).isRequired,
};

FeatureTreatment.defaultProps = {
  onLoad: () => {
    // console.log("Treatment isn't ready...");
  },
  onTimedout: () => {
    // console.log("Treatment timed out...");
  },
  invertBehavior: false,
  attributes: {},
};

FeatureTreatment.propTypes = {
  treatmentName: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  invertBehavior: PropTypes.bool,
  onTimedout: PropTypes.func || PropTypes.object,
  onLoad: PropTypes.func || PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.array.isRequired,
  ]).isRequired,
};
