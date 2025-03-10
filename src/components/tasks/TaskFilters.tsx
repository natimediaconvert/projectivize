
import React from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type DateRange = 'all' | 'today' | 'thisWeek' | 'overdue' | 'none';

type FilterValues = {
  search: string;
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  team: string[];
  dueDateRange: DateRange;
};

export default function TaskFilters({
  onFilter,
  availableTeams = [],
  availableUsers = [],
  filters,
}: {
  onFilter: (filters: FilterValues) => void;
  availableTeams?: any[];
  availableUsers?: any[];
  filters?: Partial<FilterValues>;
}) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<FilterValues>({
    defaultValues: {
      search: filters?.search || '',
      status: filters?.status || [],
      priority: filters?.priority || [],
      assignee: filters?.assignee || [],
      team: filters?.team || [],
      dueDateRange: filters?.dueDateRange || 'all',
    },
  });

  const activeFilters = watch();
  
  // Calculate active filter count
  const filterCount = 
    (activeFilters.status?.length || 0) + 
    (activeFilters.priority?.length || 0) + 
    (activeFilters.assignee?.length || 0) + 
    (activeFilters.team?.length || 0) + 
    (activeFilters.dueDateRange !== 'all' ? 1 : 0);
  
  const dueDateOptions = [
    { value: 'all', label: 'Any Due Date' },
    { value: 'today', label: 'Due Today' },
    { value: 'thisWeek', label: 'Due This Week' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'none', label: 'No Due Date' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const onSubmitFilters = (data: FilterValues) => {
    onFilter(data);
  };

  const clearFilters = () => {
    reset({
      search: '',
      status: [],
      priority: [],
      assignee: [],
      team: [],
      dueDateRange: 'all',
    });
    onFilter({
      search: '',
      status: [],
      priority: [],
      assignee: [],
      team: [],
      dueDateRange: 'all',
    });
  };

  // Helper function to toggle a value in an array filter
  const toggleArrayFilter = (field: 'status' | 'priority' | 'assignee' | 'team', value: string) => {
    const currentValues = watch(field) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setValue(field, newValues);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmitFilters)}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('search')}
              placeholder="Search tasks..."
              className="pl-8"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" type="button" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <div className="flex flex-wrap gap-1">
                    {statusOptions.map(option => (
                      <Badge
                        key={option.value}
                        variant={activeFilters.status?.includes(option.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter('status', option.value)}
                      >
                        {activeFilters.status?.includes(option.value) && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Priority</h4>
                  <div className="flex flex-wrap gap-1">
                    {priorityOptions.map(option => (
                      <Badge
                        key={option.value}
                        variant={activeFilters.priority?.includes(option.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter('priority', option.value)}
                      >
                        {activeFilters.priority?.includes(option.value) && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {availableUsers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Assignee</h4>
                    <Select 
                      value={activeFilters.assignee?.[0] || ''} 
                      onValueChange={(value) => {
                        setValue('assignee', value ? [value] : []);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any assignee</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {availableUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {availableTeams.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Team</h4>
                    <Select 
                      value={activeFilters.team?.[0] || ''} 
                      onValueChange={(value) => {
                        setValue('team', value ? [value] : []);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any team</SelectItem>
                        <SelectItem value="none">No team</SelectItem>
                        {availableTeams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium">Due Date</h4>
                  <Select 
                    value={activeFilters.dueDateRange} 
                    onValueChange={(value: any) => {
                      setValue('dueDateRange', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by due date" />
                    </SelectTrigger>
                    <SelectContent>
                      {dueDateOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                  <Button 
                    size="sm" 
                    type="submit"
                    onClick={() => handleSubmit(onSubmitFilters)()}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button type="submit">
            Search
          </Button>
        </div>
      </form>
      
      {/* Active Filters Display */}
      {filterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.status?.map(status => (
            <Badge key={status} variant="secondary" className="gap-1">
              {statusOptions.find(o => o.value === status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('status', status)}
              />
            </Badge>
          ))}
          
          {activeFilters.priority?.map(priority => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {priorityOptions.find(o => o.value === priority)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('priority', priority)}
              />
            </Badge>
          ))}
          
          {activeFilters.assignee?.map(assignee => {
            const user = availableUsers.find(u => u.id === assignee);
            return (
              <Badge key={assignee} variant="secondary" className="gap-1">
                {assignee === 'unassigned' ? 'Unassigned' : (user?.full_name || assignee)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('assignee', assignee)}
                />
              </Badge>
            );
          })}
          
          {activeFilters.team?.map(team => {
            const teamObj = availableTeams.find(t => t.id === team);
            return (
              <Badge key={team} variant="secondary" className="gap-1">
                {team === 'none' ? 'No team' : (teamObj?.name || team)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('team', team)}
                />
              </Badge>
            );
          })}
          
          {activeFilters.dueDateRange && activeFilters.dueDateRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {dueDateOptions.find(o => o.value === activeFilters.dueDateRange)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setValue('dueDateRange', 'all')}
              />
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
