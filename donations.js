// Bake sale + donation tracker data.
// Plain script (not JSON) so it loads over file:// without a fetch call.
//
// To log a new donation or bake sale total, add a line like this
// inside entries below, then save, commit, and push:
// { source: "bake-sale", amount: 85, label: "Describe it here", date: "YYYY-MM-DD" }
// source must be either "bake-sale" or "donation"
const DONATIONS_DATA = {
  goal: 500,
  entries: []
};
