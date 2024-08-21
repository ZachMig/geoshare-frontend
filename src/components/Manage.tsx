import { Country, List, Meta } from "../types";
import CreateList from "./CreateList";
import CreateLocation from "./CreateLocation";

interface ManageProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  fetchLists: () => {};
}

const Manage = ({ countries, metas, myLists, fetchLists }: ManageProps) => {
  if (!myLists) {
    fetchLists();
  }

  return (
    <div className="row mt-5">
      <div className="col-4">
        <div className="row">
          <h4 className="mt-3 ms-1">Create New Location </h4>
          <CreateLocation
            countries={countries}
            metas={metas}
            myLists={myLists}
            fetchLists={fetchLists}
          />
        </div>
        <div className="row">
          <h4 className="mt-3 ms-1">Create New List</h4>
          <CreateList fetchLists={fetchLists} />
        </div>
      </div>
      <div className="col-4">Col</div>
      <div className="col-4">Col</div>
    </div>
  );
};

export default Manage;
