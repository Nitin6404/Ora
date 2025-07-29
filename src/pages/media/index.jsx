import Navigation from "../admin/Navigation";
import PrimaryLoader from "../../components/PrimaryLoader";
import UniversalTopBar from "../../components/UniversalTopBar";
import FilterTopBar from "../../components/FilterTopBar";
import Pagination from "../../components/Pagination";
import DateRangeModal from "../../components/DateRangeModal";
import VideoDialog from "./components/VideoDialog";
import DeleteDialog from "./components/DeleteDialog";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import getAudios from "./helpers/getAudios";
import getVideos from "./helpers/getVideos";
import deleteAudio from "./helpers/deleteAudio";
import deleteVideo from "./helpers/deleteVideo";
import {
  MEDIA_FILTER_OPTIONS,
  AUDIO_COLUMN,
  VIDEO_COLUMN,
} from "../../constants";
import { isArrayWithValues } from "../../utils/isArrayWithValues";
import { debounce } from "lodash";
import PlayPauseIcon from "./components/PlayPauseIcon";
import { EllipsisVertical, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const MediaPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [videoUrl, setVideoUrl] = useState("");
  const [playAudio, setPlayAudio] = useState(false);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [dropdownId, setDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [filterOptions, setFilterOptions] = useState(MEDIA_FILTER_OPTIONS);
  const [page, setPage] = useState(1);

  const audioColumns = AUDIO_COLUMN.map((col) =>
    col.key === "audio_s3_url"
      ? {
          ...col,
          render: (row) => (
            <PlayPauseIcon
              url={row.audio_s3_url}
              id={row.id}
              isPlaying={playingAudioId === row.id}
              onClick={() => handleAudioPlayPause(row.audio_s3_url, row.id)}
            />
          ),
        }
      : col.key === "action"
      ? {
          ...col,
          render: (row) => (
            <EllipsisVertical
              className="hover:cursor-pointer w-5 h-5"
              onClick={(e) => {
                if (dropdownId === row.id) {
                  setDropdownId(null);
                  return;
                }

                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                });

                setDropdownId(row.id);
              }}
            />
          ),
        }
      : col
  );

  const videoColumns = VIDEO_COLUMN.map((col) =>
    col.key === "action"
      ? {
          ...col,
          render: (row) => (
            <EllipsisVertical
              className="hover:cursor-pointer w-5 h-5"
              onClick={(e) => {
                if (dropdownId === row.id) {
                  setDropdownId(null);
                  return;
                }

                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                });

                setDropdownId(row.id);
              }}
            />
          ),
        }
      : col
  );

  const debounced = useMemo(
    () =>
      debounce((val) => {
        setDebouncedSearch(val);
        setPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (val) => {
    setSearch(val);
    debounced(val);
  };

  const handleFilterChange = (type) => {
    setFilterOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isActive: option.id === type,
      }))
    );
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
  };

  const handleAudioPlayPause = (url, id) => {
    if (!audioRef.current) return;

    const isSameAudio = playingAudioId === id;

    if (isSameAudio && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      if (!isSameAudio) {
        audioRef.current.src = url;
      }
      audioRef.current.play();
      setPlayingAudioId(id);
    }
  };

  const params = {
    page,
    search: debouncedSearch,
    ...(startDate &&
      endDate && {
        start_date: startDate,
        end_date: endDate,
      }),
  };

  const queryFn =
    filterOptions.find((option) => option.isActive).id === "audio"
      ? getAudios
      : getVideos;

  const mediaType = filterOptions.find((option) => option.isActive).id;

  const queryKey = useMemo(
    () => [mediaType, debouncedSearch, page],
    [mediaType, debouncedSearch, page]
  );
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(params),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      filterOptions.find((option) => option.isActive).id === "audio"
        ? deleteAudio(id)
        : deleteVideo(id),
    onSuccess: () => {
      toast.success("Media deleted successfully");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error("Failed to delete media");
    },
  });

  const handleAddMedia = () => {
    navigate("/media/add");
  };
  const handleEditMedia = (id) => {
    console.log(filterOptions.find((option) => option.isActive).id);
    navigate(`/media/edit/${id}`, {
      state: {
        type: filterOptions.find((option) => option.isActive).id,
      },
    });
  };
  const handleDeleteMedia = (id) => {
    setDropdownId(null);
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const columns =
    filterOptions.find((option) => option.isActive).id === "audio"
      ? audioColumns
      : videoColumns;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <Navigation>
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar defaultTitle="Media" />

        <FilterTopBar
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchPlaceholder={`Search ${
            filterOptions.find((option) => option.isActive).id
          }...`}
          onAddClick={handleAddMedia}
          addButtonText="Add New Media"
          startDate={startDate}
          endDate={endDate}
          onDateSelect={() => setShowDateRange(true)} // Open modal
        />

        <div className="flex-1 overflow-y-auto no-scrollbar bg-white/10">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <PrimaryLoader />
            </div>
          ) : (
            <table className="min-w-full border-separate border-spacing-y-2 px-2">
              <thead className="bg-white/35">
                <tr className="sticky top-2 z-[60] bg-[#C7C2F9] rounded-[2.625rem] h-[3.125rem] text-[#181D27] text-[12px] leading-[18px] font-medium">
                  {columns.map((col, i) => (
                    <th
                      key={col.key}
                      className={`text-left px-3 py-2 ${
                        i === 0 ? "rounded-l-[2.625rem]" : ""
                      } 
                      ${col.key === "id" ? "pl-8" : ""}
                      ${
                        i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isArrayWithValues(data?.results) ? (
                  data.results.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white/90 rounded-[2.625rem] h-[3.5rem] px-[2rem] text-[#181D27] text-[12px] font-medium hover:bg-[#E3E1FC]"
                    >
                      {columns.map((col, i) => (
                        <td
                          key={col.key}
                          className={`px-3 py-2 ${
                            i === 0 ? "rounded-l-[2.625rem]" : ""
                          } 
                          ${col.key === "id" ? "pl-8" : ""}
                          ${
                            i === columns.length - 1
                              ? "rounded-r-[2.625rem]"
                              : ""
                          }`}
                          onClick={() => {
                            if (col.key === "video_s3_url") {
                              setVideoDialogOpen(true);
                              setVideoUrl(row.video_s3_url);
                            }
                            if (col.key === "audio_s3_url") {
                              setPlayAudio(true);
                              setAudioUrl(row.audio_s3_url);
                            }
                          }}
                        >
                          {typeof col.render === "function"
                            ? col.render(row)
                            : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No media found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="h-16 flex-shrink-0 z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {data?.count > 0 && (
                <Pagination
                  pageCount={Math.ceil(data.count / 10)} // assuming 10 items per page
                  currentPage={page}
                  handlePageChange={setPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {dropdownId && (
        <div
          className="dropdown-menu absolute bg-white z-[100] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left - 150}px`, //adjust left based on width
            width: "160px",
          }}
        >
          <button
            onClick={() => handleEditMedia(dropdownId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={16} className="w-5 h-5 text-blue-600" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteMedia(dropdownId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Trash2 size={16} className="w-5 h-5 text-red-600" />
            Delete
          </button>
        </div>
      )}

      {showDateRange && (
        <DateRangeModal
          show={showDateRange}
          onClose={() => setShowDateRange(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            setShowDateRange(false);
            setPage(1);
            queryClient.invalidateQueries({ queryKey });
          }}
        />
      )}

      <VideoDialog
        open={videoDialogOpen}
        onClose={() => {
          setVideoDialogOpen(false);
          setVideoUrl("");
        }}
        videoUrl={videoUrl}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
        }}
      />

      <audio ref={audioRef} style={{ display: "none" }} />
    </Navigation>
  );
};

export default MediaPage;
