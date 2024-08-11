import { Country, List, Meta } from "../types";
import CreateLocation from "./CreateLocation";

interface ManageProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[];
  myLocations: Location[];
  refreshData: () => {};
}

const Manage = ({
  countries,
  metas,
  myLists,
  myLocations,
  refreshData,
}: ManageProps) => {
  return (
    <div className="row mt-5">
      <div className="col-4">Col</div>
      <div className="col-4">
        <CreateLocation
          countries={countries}
          metas={metas}
          myLists={myLists}
          myLocations={myLocations}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default Manage;
