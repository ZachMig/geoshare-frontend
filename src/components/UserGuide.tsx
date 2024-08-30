const UserGuide = () => {
  return (
    <div
      className="row mt-5 mx-4"
      style={{ fontSize: "18px", lineHeight: "175%" }}
    >
      <h1>GeoSave - User Guide</h1>
      <div className="col-4">
        <p>
          The <b>Manage Locations</b> tab provides several pieces of
          functionality.
        </p>
        <p>
          First, it allows you get started by{" "}
          <b>
            <i>creating locations</i>
          </b>
          . When you create a new location, you can select any number of lists
          for it to be a part of. If no list is selected, or you haven't created
          any lists yet, the location will automatically be part of a default
          "Unlisted" list that every user has.
        </p>
        <p>
          Second, allows you to{" "}
          <b>
            <i>create new lists</i>
          </b>{" "}
          to start including locations in. You cannot include any locations in
          your list upon creating it. Instead, the next part of the Manage
          Locations tab provides this functionality.
        </p>
        <p>
          Under Unlink or Link Locations you can see a text input field which
          will open a filterable dropdown with all your lists. Selecting a list
          here will bring up two groups of filterable locations. The left group
          represents all locations that are in the selected list. The right
          group represents all locations that are not in the selected list, i.e.
          all of your other saved locations. Selecting any number of locations
          and clicking the Unlink and Link button will{" "}
          <b>
            <i>swap the selected locations in and out of the selected list.</i>
          </b>{" "}
          All selected locations that were part of this list will no longer be,
          and all selected locations that were not part of this list, now will
          be.
        </p>
        <p>
          <b>Note: </b> All locations created or updated should have a Google
          Maps URL which includes data of the following style:
          "@40.9482919,-74.0712503,3a,80.7y,17.16h,86.25t" which is found right
          at the beginning e.g.
          google.com/maps/@40.9482919,-74.0712503,3a,80.7y,17.16h,86.25t/...{" "}
          <br />
          If this data is not provided, the visual preview of your location will
          not be available.
        </p>
      </div>
      <div className="col-4">
        <p>
          The <b>My Locations</b> tab will allow you to view your saved
          locations and any lists you have made.
        </p>
        <p>
          The leftmost column will display all of your lists, including the
          "Unlisted" list which holds locations that do not belong to any list.
          Selecting a list from the left column will populate the middle column
          with all the locations belonging to that list. As always, these
          locations can be filtered based on name, country, and meta. Selecting
          a location here will populate the third, rightmost column. This will
          display a small visual preview of the actual location, as well as a
          link to the Street View itself, and the location's country and meta.
        </p>
        <p>
          This view will allow you{" "}
          <b>
            <i>edit or delete</i>
          </b>{" "}
          your lists and locations. Locations have an additional action that can
          be performed on them. They can be unlinked from the list you currently
          have selected.
        </p>
      </div>
      <div className="col-4">
        <p>
          The last tab, <b>Everyone Else's Locations</b>, allows you to search
          all lists and locations currently maintained by GeoSave users. This
          tab can be accessed without a GeoSave account.
        </p>
        <p>
          This tab allows you to{" "}
          <b>
            <i>search for lists</i>
          </b>{" "}
          by either list name, or by a GeoSave username. The search type can be
          toggled back and forth by the slider next to the input field.
          Searching by list name will show all lists that include the search
          term (e.g. searching for "poland" will bring up any list that includes
          the term "poland"). Searching by username will only return lists owned
          by the account indicated by that exact username (e.g. searching "zmig"
          will not bring up any of the lists owned by user "zmigliorini").
        </p>
      </div>
    </div>
  );
};

export default UserGuide;
