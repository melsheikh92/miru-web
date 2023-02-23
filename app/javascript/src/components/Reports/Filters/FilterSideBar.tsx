/* eslint-disable react/hook-use-state */
import React, { useState, useEffect, useRef } from "react";

import dayjs from "dayjs";
import { useDebounce, useOutsideClick } from "helpers";
import { XIcon, FilterIcon } from "miruIcons";
import { SidePanel, Button } from "StyledComponents";

import { useEntry } from "components/Reports/context/EntryContext";
import { useUserContext } from "context/UserContext";

import ClientFilter from "./ClientFilter";
import DateRangeFilter from "./DateRangeFilter";
import { statusOption } from "./filterOptions";
import { dateRangeOptions } from "./FilterSidebarOptions";
import GroupByFilter from "./GroupByFilter";
import StatusFilter from "./StatusFilter";
import TeamMembersFilter from "./TeamMembersFilter";

const FilterSidebar = ({
  setIsFilterVisible,
  selectedFilter,
  setFilterCounter,
  resetFilter,
  handleApplyFilter,
  setSelectedInput,
  selectedInput,
}) => {
  const {
    timeEntryReport: { selectedFilter: selectedContextFilter, filterOptions },
  } = useEntry();

  const { clients: clientList, teamMember: teamMemberList } =
    selectedContextFilter;

  const { clients: selctedClientList, teamMembers: teamMembersList } =
    filterOptions;
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isGroupByOpen, setIsGroupByOpen] = useState<boolean>(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>(selectedFilter);
  const [showCustomFilter, setShowCustomFilter] = useState<boolean>(
    filters.dateRange.value === "custom"
  );
  const [showCustomCalendar, setShowCustomCalendar] = useState<boolean>(true);
  const [isClientOpen, setIsClientOpen] = useState<boolean>(false);
  const [isTeamMemberOpen, setIsTeamMemberOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [TeamMembersearchQuery, setTeamMemberSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<any[]>(clientList);
  const [selectedTeams, setSelectedTeams] = useState<any[]>(teamMemberList);
  const [filteredClientList, setFilteredClientList] =
    useState<any[]>(selctedClientList);

  const [filteredTeamsList, setFilteredTeamsList] =
    useState<any[]>(teamMembersList);
  const [dateRange, setDateRange] = useState<any>(filters.customDateFilter);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedTeamsSearchQuery = useDebounce(TeamMembersearchQuery, 500);
  const { isDesktop } = useUserContext();
  const [disableDateBtn, setDisableDateBtn] = useState<boolean>(true);
  const [disableApplyBtn, setDisableApplyBtn] = useState(false);
  const wrapperRef = useRef(null);

  useOutsideClick(
    wrapperRef,
    () => setShowCustomCalendar(false),
    selectedInput
  );

  const handleSelectGroupByFilter = SelectedGroup => {
    setFilters({
      ...filters,
      groupBy: SelectedGroup,
    });
  };

  const handleOpenDateCalendar = () => {
    if (!showCustomCalendar) {
      setShowCustomCalendar(true);
    }
  };

  useEffect(() => {
    const { value } = filters.dateRange;
    if (value == "all") {
      setDateRange({ ...dateRange, from: "", to: "" });
    }

    if (dateRange.from && dateRange.to) {
      setDisableDateBtn(false);
    }
  }, [filters.dateRange.value, dateRange.from, dateRange.to]);

  useEffect(() => {
    if (filteredClientList.length) {
      const sortedClients = filteredClientList.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      if (debouncedSearchQuery && filteredClientList.length > 0) {
        const newClientList = sortedClients.filter(client =>
          client.label
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        );

        newClientList.length > 0
          ? setFilteredClientList(newClientList)
          : setFilteredClientList([]);
      } else {
        setFilteredClientList(filterOptions?.clients);
      }
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setFilters({
      ...filters,
      customDateFilter: dateRange,
    });
  }, [dateRange]);

  useEffect(() => {
    if (
      filters.dateRange.value == "custom" &&
      !filters.dateRange.from &&
      !filters.dateRange.to &&
      disableDateBtn
    ) {
      setDisableApplyBtn(true);
    } else {
      setDisableApplyBtn(false);
    }
  }, [filters, disableDateBtn]);

  useEffect(() => {
    if (filteredTeamsList.length) {
      const sortedClients = filteredTeamsList.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      if (debouncedTeamsSearchQuery && filteredTeamsList.length > 0) {
        const newClientList = sortedClients.filter(client =>
          client.label
            .toLowerCase()
            .includes(debouncedTeamsSearchQuery.toLowerCase())
        );

        newClientList.length > 0
          ? setFilteredTeamsList(newClientList)
          : setFilteredTeamsList([]);
      } else {
        setFilteredTeamsList(filterOptions?.teamMembers);
      }
    }
  }, [debouncedTeamsSearchQuery]);

  const handleSelectClient = selectedClient => {
    if (filters.clients.includes(selectedClient)) {
      const newarr = selectedClients.filter(
        client => client.value != selectedClient.value
      );

      setFilters({
        ...filters,
        clients: newarr,
      });

      setSelectedClients(newarr);
    } else {
      setFilters({
        ...filters,
        clients: [...filters.clients, selectedClient],
      });
      setSelectedClients([...selectedClients, selectedClient]);
    }
  };

  const handleSelectTeamMember = selectedTeamMember => {
    if (
      filters.teamMember.find(
        filter => filter.value === selectedTeamMember.value
      )
    ) {
      const newarr = selectedTeams.filter(
        team => team.value != selectedTeamMember.value
      );

      setFilters({
        ...filters,
        teamMember: newarr,
      });

      setSelectedTeams(newarr);
    } else {
      setFilters({
        ...filters,
        teamMember: [...filters.teamMember, selectedTeamMember],
      });
      setSelectedTeams([...selectedTeams, selectedTeamMember]);
    }
  };

  const setDefaultDateRange = () => ({
    ...filters,
    ["dateRange"]: { value: "all", label: "All", from: "", to: "" },
  });

  const handleSelectFilter = (selectedValue, field) => {
    if (selectedValue.value !== "custom") {
      dateRangeOptions[4].label = "Custom";
      setDefaultDateRange();
      hideCustomFilter();
      setDateRange({ from: "", to: "" });
    }

    if (selectedValue.value === "custom") {
      setShowCustomFilter(true);
      setFilters({
        ...filters,
        [field.name]: { ...selectedValue, ...dateRange },
      });
    }

    if (field.name == "dateRange") {
      setFilters({
        ...filters,
        [field.name]: selectedValue,
      });
    }

    if (field.name != "dateRange") {
      if (field.checked) {
        setFilters({
          ...filters,
          [field.name]: filters[field.name].concat(selectedValue),
        });
      } else {
        const newarr = filters[field.name].filter(
          client => client.value != selectedValue.value
        );

        setFilters({
          ...filters,
          [field.name]: newarr,
        });
      }
    }
  };

  const submitCustomDatePicker = () => {
    if (dateRange.from && dateRange.to) {
      const fromDate = dayjs(dateRange.from).format("Do MMM");
      const toDate = dayjs(dateRange.to).format("Do MMM");
      dateRangeOptions[4].label = `Custom (${fromDate} - ${toDate})`;
      setFilters({
        ...filters,
        ["dateRange"]: {
          value: "custom",
          label: `Custom (${fromDate} - ${toDate})`,
          ...dateRange,
        },
      });
    }
  };

  const handleSelectDate = date => {
    if (selectedInput === "from-input") {
      setDateRange({ ...dateRange, ...{ from: date } });
    } else {
      setDateRange({ ...dateRange, ...{ to: date } });
    }
  };

  const hideCustomFilter = () => {
    setShowCustomFilter(false);
  };

  const onClickInput = e => {
    setSelectedInput(e.target.name);
  };

  const handleApply = () => {
    if (disableApplyBtn) {
      return;
    }
    submitCustomDatePicker();
    handleApplyFilter(filters);
    setFilterCounter(selectedClients.length);
    setIsFilterVisible(false);
  };

  return (
    <SidePanel
      WrapperClassname="z-50 justify-content-between"
      setFilterVisibilty={setIsFilterVisible}
    >
      <div>
        <SidePanel.Header className="mb-2 flex items-center justify-between bg-miru-han-purple-1000 px-5 py-5 text-white lg:bg-white lg:font-bold lg:text-miru-dark-purple-1000">
          {isDesktop ? (
            <h4 className="flex items-center text-base">
              <FilterIcon className="mr-2.5" size={16} /> <span>Filters</span>
            </h4>
          ) : (
            <span className="flex w-full items-center justify-center pl-6 text-base font-medium leading-5">
              Filters
            </span>
          )}
          <Button style="ternary" onClick={() => setIsFilterVisible(false)}>
            <XIcon
              className="text-white lg:text-miru-dark-purple-1000"
              size={16}
            />
          </Button>
        </SidePanel.Header>
        <SidePanel.Body className="sidebar__filters max-h-80v min-h-80v overflow-y-auto">
          <DateRangeFilter
            dateRange={dateRange}
            dateRangeList={dateRangeOptions}
            filters={filters}
            handleOpenDateCalendar={handleOpenDateCalendar}
            handleSelectDate={handleSelectDate}
            handleSelectFilter={handleSelectFilter}
            isDateRangeOpen={isDateRangeOpen}
            selectedInput={selectedInput}
            setIsClientOpen={setIsClientOpen}
            setIsDateRangeOpen={setIsDateRangeOpen}
            setIsStatusOpen={setIsStatusOpen}
            setShowCustomCalendar={setShowCustomCalendar}
            showCustomCalendar={showCustomCalendar}
            showCustomFilter={showCustomFilter}
            submitCustomDatePicker={submitCustomDatePicker}
            wrapperRef={wrapperRef}
            onClickInput={onClickInput}
          />
          <ClientFilter
            filteredClientList={filteredClientList}
            handleSelectClient={handleSelectClient}
            isClientOpen={isClientOpen}
            searchQuery={searchQuery}
            selectedClients={filters.clients}
            setIsClientOpen={setIsClientOpen}
            setSearchQuery={setSearchQuery}
          />
          <TeamMembersFilter
            filteredTeamsList={filteredTeamsList}
            handleSelectTeamMember={handleSelectTeamMember}
            isTeamMemberOpen={isTeamMemberOpen}
            searchQuery={TeamMembersearchQuery}
            selectedTeams={selectedTeams}
            setIsTeamMemberOpen={setIsTeamMemberOpen}
            setSearchQuery={setTeamMemberSearchQuery}
          />
          <StatusFilter
            filters={filters}
            handleSelectFilter={handleSelectFilter}
            isStatusOpen={isStatusOpen}
            setIsClientOpen={setIsClientOpen}
            setIsDateRangeOpen={setIsDateRangeOpen}
            setIsStatusOpen={setIsStatusOpen}
            statusOptions={statusOption}
          />
          <GroupByFilter
            filters={filters}
            handleSelectFilter={handleSelectGroupByFilter}
            isGroupByOpen={isGroupByOpen}
            setIsClientOpen={setIsClientOpen}
            setIsDateRangeOpen={setIsDateRangeOpen}
            setIsGroupByOpen={setIsGroupByOpen}
            setIsStatusOpen={setIsStatusOpen}
          />
        </SidePanel.Body>
      </div>
      <SidePanel.Footer className="sidebar__footer justify-between">
        <Button
          className="mr-4 flex items-center justify-between"
          size="medium"
          style="secondary"
          onClick={resetFilter}
        >
          RESET
        </Button>
        <Button
          disabled={disableApplyBtn}
          size="medium"
          style="primary"
          onClick={handleApply}
        >
          APPLY
        </Button>
      </SidePanel.Footer>
    </SidePanel>
  );
};

export default FilterSidebar;
