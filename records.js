(function () {
  "use strict";

  const IPF_SOURCE = {
    name: "International Powerlifting Federation (IPF) Open Classic World Records",
    menUpdated: "Aug 9, 2026",
    womenUpdated: "Jun 27, 2026",
    url: "https://www.powerlifting.sport/championships/records",
    note: "Absolute Open Classic records across all bodyweight classes. Deadlift records do not separate conventional and sumo technique."
  };

  const GUINNESS_PULL_UP_SOURCE = {
    name: "Guinness World Records",
    menUpdated: "Nov 10, 2024",
    url: "https://www.guinnessworldrecords.com/world-records/117715-most-consecutive-pull-ups",
    note: "Most consecutive pull-ups. Guinness currently lists no female holder for the corresponding untimed record."
  };

  const GUINNESS_CHIN_UP_SOURCE = {
    name: "Guinness World Records",
    menUpdated: "Dec 29, 1994",
    url: "https://www.guinnessworldrecords.com/world-records/most-consecutive-chin-ups",
    note: "Most consecutive chin-ups. No separate current female metric is published for this untimed title."
  };

  const GUINNESS_SQUAT_SOURCE = {
    name: "Guinness World Records",
    menUpdated: "May 24, 2025",
    url: "https://www.guinnessworldrecords.com/world-records/769766-most-consecutive-squats-male",
    note: "Most consecutive bodyweight squats. No corresponding untimed female record was found in the published Guinness catalog."
  };

  // These are the highest current Open Classic records in the official IPF table.
  // They are one-repetition competition lifts in kilograms.
  const RECORDS = {
    "bench-press": {
      male: 291.5,
      female: 167,
      kind: "weight",
      lift: "Bench press",
      source: IPF_SOURCE
    },
    "back-squat": {
      male: 478,
      female: 318.5,
      kind: "weight",
      lift: "Squat",
      source: IPF_SOURCE
    },
    "deadlift": {
      male: 411,
      female: 292.5,
      kind: "weight",
      lift: "Deadlift",
      source: IPF_SOURCE
    },
    "sumo-deadlift": {
      male: 411,
      female: 292.5,
      kind: "weight",
      lift: "Deadlift",
      source: IPF_SOURCE,
      note: "The IPF record table combines legal deadlift techniques rather than publishing a separate sumo record."
    },
    "pull-up": {
      male: 1224,
      female: null,
      kind: "reps",
      lift: "Consecutive pull-ups",
      source: GUINNESS_PULL_UP_SOURCE
    },
    "chin-up": {
      male: 612,
      female: null,
      kind: "reps",
      lift: "Consecutive chin-ups",
      source: GUINNESS_CHIN_UP_SOURCE
    },
    "bodyweight-squat": {
      male: 1100,
      female: null,
      kind: "reps",
      lift: "Consecutive bodyweight squats",
      source: GUINNESS_SQUAT_SOURCE
    }
  };

  function lookup(exerciseId, standard) {
    const record = RECORDS[exerciseId];
    if (!record) return null;
    const sex = standard === "female" ? "female" : "male";
    const value = Number(record[sex]);
    if (!(value > 0)) return null;
    const result = {
      exerciseId: exerciseId,
      standard: sex,
      kind: record.kind || "weight",
      lift: record.lift,
      source: record.source,
      note: record.note || ""
    };
    if (result.kind === "reps") result.valueReps = value;
    else result.valueKg = value;
    return result;
  }

  function status(exerciseId, standard) {
    const record = lookup(exerciseId, standard);
    return record
      ? { standardized: true, record: record }
      : {
          standardized: false,
          record: null,
          reason: RECORDS[exerciseId]
            ? "No published, directly comparable " + (standard === "female" ? "women's" : "men's") + " world-record metric is available for this exercise."
            : "No standardized, directly comparable world record exists for this exercise. Machine leverage, equipment setup, range of motion, timed rules, or rep rules are not universal."
        };
  }

  window.FossWorldRecords = {
    lookup: lookup,
    status: status,
    source: function () { return Object.assign({}, IPF_SOURCE); },
    ids: function () { return Object.keys(RECORDS); }
  };
})();
