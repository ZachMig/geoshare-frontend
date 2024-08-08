import { Country, Meta } from "../types";
import CreateLocation from "./CreateLocation";

interface ManageProps {
  countries: Country[];
  metas: Meta[];
  refreshData: () => {};
}

const Manage = ({ countries, metas, refreshData }: ManageProps) => {
  return (
    <div className="row mt-5">
      <div className="col-4">Col</div>
      <div className="col-4">
        <CreateLocation
          countries={countries}
          metas={metas}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default Manage;
